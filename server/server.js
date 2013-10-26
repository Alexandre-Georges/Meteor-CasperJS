Meteor.methods(
    {
        'sendMessage': function(message) {
            Messages.insert(_.extend(message, { date: moment().valueOf() }));
        },
        'resetDatabase': function() {
            Messages.remove({});
        }
    }
);