Meteor.Router.add({
    '/': 'home',
    '/page1Url': 'page1',
    '/page2Url': 'page2',
    '/resetUrl': function () {
        Meteor.call('resetDatabase', function(error) {
            if (error)
                return alert(error.reason);
        });
    }
});

Template.home.events(
    {
        'submit form': function(event) {
            event.preventDefault();
            
            var message = {
                user: $(event.target).find('input[name="user"]').val(),
                text: $(event.target).find('input[name="text"]').val()
            };
            
            Meteor.call('sendMessage', message, function(error, id) {
                if (error)
                    return alert(error.reason);
            });

        }
    }
);

Template.messages.messages = function () {
    var messages = [];
    Messages.find({}, { sort: { date: -1 } }).forEach(function(message) {
        messages.push(_.extend(message, { date: moment(message.date).format("DD/MM/YYYY HH:mm:ss") }));
    });
    return messages;
};
/*
function testage() {
    var creationDate = moment();
                var realDate = moment(document.querySelector('body table tr td:nth-child(1)').innerHTML, 'DD/MM/YYYY HH:mm:ss');
                var diff = Math.abs(realDate.diff(creationDate, 'milliseconds'));
    
    console.log(diff); 
}*/