import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

export default class ActivityStore {
    //activities: Activity[] = [];  can use this or map like below.
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadingActivities = async () => {
        //this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
            activity.date = activity.date.split('T')[0];
            //this.activities.push(activity); //mobX has immutable objects   
            this.activityRegistry.set(activity.id, activity);                         
            })
            this.setLoadingInitial(false);                  
        }
        catch (error) {
            console.log(error);
            this.setLoadingInitial(false);                     
        }
    } 
    
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id); //old way: this.activities.find(x => x.id === id);
    }
    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }
    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
       
        activity.id = uuid();
        try{
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);//this.activities.push(activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
           })
           
        }
        catch (error) {
            console.log(error);          
            runInAction(() => { 
                this.loading = false;
           })                   
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try{
            await agent.Activities.update(activity);
            runInAction(() => {
                //this.activities = [...this.activities.filter(a => a.id !== activity.id), activity]; //creates a new array and passes in new activity
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;                
                //OR this.activities.filter(a => a.id !== activity.id);
                //this.activities.push(activity);             
             
                this.loading = false;
           })
           
        }
        catch (error) {
            console.log(error);          
            runInAction(() => { 
                this.loading = false;
           })                   
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try{
            await agent.Activities.delete(id);
            runInAction(() => {
                //this.activities = [...this.activities.filter(a => a.id !== id)]; 
                this.activityRegistry.delete(id);
                if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;
           })
           
        }
        catch (error) {
            console.log(error);          
            runInAction(() => { 
                this.loading = false;
           })                   
        }
    }
}