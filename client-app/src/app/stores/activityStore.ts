import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {format } from 'date-fns';

export default class ActivityStore {
    //activities: Activity[] = [];  can use this or map like below.
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
        a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) =>  {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    loadingActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
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

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
              
        if (activity) {           
            this.selectedActivity = activity;
            return activity;
        } else {            
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })                
                this.setLoadingInitial(false);
                return activity;
            } catch (error)
            {
                console.log("Error: ", error);
                this.setLoadingInitial(false);
            }
        }        
    }

    private setActivity = (activity: Activity) => {
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }
    
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) => {   
        this.loading = true;           
        try{
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
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