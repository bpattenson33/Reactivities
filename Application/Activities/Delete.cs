using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command: IRequest
        {
            public Guid Id { get; set;}
        }
        public class Handler: IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;               
            }
            
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);
                _context.Remove(activity);    
      
              
                // ReSharper disable once MethodSupportsCancellation
                // Not using cancellationToken at this point but used if user closes browser. Have to pass it in 
                //for app to cancel task.
                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }

    }
}