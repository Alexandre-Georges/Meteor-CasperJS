//casperjs test --includes=../lib/moment.min.js end2end.js

CLIENT_SERVER_DELAY = 200;
ACCEPTABLE_DELAY = 5000;

casper.test.begin('Reset', function (test) {
    
    casper.start('http://localhost:3000/resetUrl');

    casper.run(function() {
        test.done();
    });
    
});

casper.test.begin('Navigation', function (test) {
    
    casper.start('http://localhost:3000', function() {
        test.assertTitle("Meteor-CasperJS");
        test.assertElementCount('body a', 2);
        /*this.fill('form[action="/search"]', {
            q: "casperjs"
        }, true);*/
    });
    
    casper.then(function() {
        this.click('body a:first-child');
    });
    
    casper.then(function() {
        test.assertUrlMatch(/^http\:\/\/.*\/page1Url$/, this.getCurrentUrl());
        test.assertElementCount('body a', 1);
    });
    
    casper.then(function() {
        this.click('body a');
    });
    
    casper.then(function() {
        test.assertElementCount('body a', 2);
        this.click('body a:last-of-type');
    });
    
    casper.then(function() {
        test.assertUrlMatch(/^http\:\/\/.*\/page2Url$/, this.getCurrentUrl());
        test.assertElementCount('body a', 1);
    });

    casper.run(function() {
        test.done();
    });
    
});

casper.test.begin('Send message', function (test) {
    
    casper.start('http://localhost:3000', function() {
        test.assertElementCount('body form[name="sendMessage"]', 1);
        test.assertElementCount('body form[name="sendMessage"] input', 3);
        test.assertElementCount('body form[name="sendMessage"] input[name="user"]', 1);
        test.assertElementCount('body form[name="sendMessage"] input[name="text"]', 1);
        test.assertElementCount('body form[name="sendMessage"] input[name="send"][type="submit"]', 1);
        test.assertElementCount('body table', 1);
        test.assertElementCount('body table tr', 0);
    });
    
    var creationDate = null;
    
    casper.then(function() {
        this.fill('body form[name="sendMessage"]', {
            'user': 'Alex',
            'text': 'Hey'
        }, true);
        creationDate = moment();
    });
    
    casper.then(function() {
        this.wait(CLIENT_SERVER_DELAY, function() {
            
            test.assertElementCount('body table tr', 1);
            
            test.assertEval(function(acceptableDelay, creationDate) {
                
                var realDate = moment(document.querySelector('body table tr td:nth-child(1)').innerHTML, 'DD/MM/YYYY HH:mm:ss');
                var diff = Math.abs(realDate.diff(creationDate, 'milliseconds'));
                return diff < acceptableDelay;
                
            }, 'Date value', { acceptableDelay: ACCEPTABLE_DELAY, creationDate: creationDate });
            
            test.assertEval(function() {
                return document.querySelector('body table tr td:nth-child(2)').innerHTML === 'Alex';
            }, 'Username value');
            
            test.assertEval(function() {
                return document.querySelector('body table tr td:nth-child(3)').innerHTML === 'Hey';
            }, 'Text value');
            
        });
    });
    
    casper.then(function() {
        
        this.fill('body form[name="sendMessage"]', {
            'user': 'Alex2',
            'text': 'Hey2'
        }, false);
        
        creationDate = moment();
        
        this.click('body form[name="sendMessage"] input[name="send"][type="submit"]');
    });
    
    casper.then(function() {
        
        this.wait(CLIENT_SERVER_DELAY, function() {
            
            test.assertElementCount('body table tr', 2);
            
            test.assertEval(function(acceptableDelay, creationDate) {
                
                var realDate = moment(document.querySelector('body table tr:nth-child(1) td:nth-child(1)').innerHTML, 'DD/MM/YYYY HH:mm:ss');
                var diff = Math.abs(realDate.diff(creationDate, 'milliseconds'));
                return diff < acceptableDelay;
                
            }, 'Date value', { acceptableDelay: ACCEPTABLE_DELAY, creationDate: creationDate });
            
            test.assertEval(function() {
                return document.querySelector('body table tr:nth-child(1) td:nth-child(2)').innerHTML === 'Alex2';
            }, 'Username value');
            
            test.assertEval(function() {
                return document.querySelector('body table tr:nth-child(1) td:nth-child(3)').innerHTML === 'Hey2';
            }, 'Text value');
            
            
            test.assertEval(function() {
                return document.querySelector('body table tr:nth-child(2) td:nth-child(2)').innerHTML === 'Alex';
            }, 'Username value');
            
            test.assertEval(function() {
                return document.querySelector('body table tr:nth-child(2) td:nth-child(3)').innerHTML === 'Hey';
            }, 'Text value');
            
        });
    });
 
    casper.run(function() {
        test.done();
    });
    
});