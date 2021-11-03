function User(name, email) {
    this.pseudoname = name;
    this.email = email;
}

function init() {
    //when the page loads
    //create the scoket and connect to server on port 3000
    //creating the socket is done once and the reference to the socket object 
    //is stored in a global variable for subsequent use
    socket = io.connect('http://localhost:3000');

    // refresh list participants
    $('#participants').click(function(e) {
        $('#users').empty();
        e.preventDefault();
        $.get("/api/users", function(users) {
                console.log("success loading participants");
                for (let i = 0; i < users.length; i++) {
                    let item = users[i];
                    $('#users').append($('<li>').attr('id', 'U' + item.id).html(item.pseudoname + "(" + item.email + ")"));
                }
            })
            .fail(function() {
                console.log("error loading participants");
            });
    });

    // show details of a signle participant
    $('#users').click(function(event) {
        //Get the id of list items
        let target = $(event.target);
        if (target.is("li")) {
            $("#users").children().css("background-color", "black");
            target.css("background-color", "red");
            let userId = target.attr('id').substring(1);
            event.preventDefault();
            $.get("/api/users/" + userId,
                    function(user) {
                        console.log("success loading user details");
                        $('#userName').html("<i>" + user.pseudoname + "</i>");
                        $('#userEmail').html("<i>" + user.email + "</i>");
                        $('#userId').html("<i>" + user.id + "</i>");
                    })
                .fail(function() {
                    console.log("error loading user details");
                });
        }

    });


    // submit text message without reload/refresh the page
    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        //send the value of the input to server through socket
        socket.emit('submitted_message', $('#txt').val());
        $('#txt').val(''); //empty the input field for any new message to b typed
        return false;
    });

    // when receiving th 'participant' event, append text with username
    socket.on('participant', function(message) {
        $('#messages').append($('<li>').html(message));
    });

    // when 'chat_message' event is received, append message received from server username
    socket.on('submitted_message', function(msg) {
        $('#messages').append($('<li>').html(msg));
    });

    // Whe the server process a user connection, it raises 'logged' event
    //here we send a post request to the server check if he/she is new
    //in such case, we insert it in the DB at the server
    socket.on('logged', function(who) {
        console.log('Logged event received from server');
        console.log('Pseudo: ' + who.pseudoname);
        console.log('Email: ' + who.email);
        //send a POST request with jQuery and AJAX
        $.ajax({
            type: 'post',
            url: '/api/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ who }), //stringify the data object
            success: function(theuser) { //define the call back on success 
                //receive a composite object from server with old and the user
                //old is false when user has just been inserted in the DB
                console.log("who: " + user.email);
                console.log("theuser: " + theuser.obj.email);
                if (user.email === theuser.obj.email) {
                    if (theuser.old) {
                        $('#greet').html("<b> back</b>");
                    } else {
                        $('#greet').html("<b> (new)</b>");
                    }
                    $('#name').html("<i>" + theuser.obj.pseudoname + "</i>");
                    $('#email').html("<i>" + theuser.obj.email + "</i>");
                    $('#id').html("<i>" + theuser.obj.id + "</i>");
                }
            },
            dataType: 'json'
        });
        /* 
        we can also do it this way   using jquery encapsulation of AJAX   
        $.post('/api/login', JSON.stringify(auser), function(auser) { 
                if (auser.old) {
                    $('#users').append($('<li>').html(auser.obj.pseudoname + "(" + auser.obj.email + ")"));
                } else {
                   $('#users').append($('<li>').html(auser.obj.pseudoname + "(" + auser.obj.email + ") - new"));
                }

            })
            .fail(function() {
                console.log("error loading user");
            });
        */
    });


    //this is to create a dialog with the div loginDialog deined in the HTML
    $(".loginDialog").dialog({
        closeOnEscape: false,
        maxWidth: 600,
        maxHeight: 500,
        width: 400,
        height: 150,
        modal: true,
        open: function(event, ui) {
            //when the dialog displays, we hode the close (x) button
            //to avoid the user from closing the dialog intempestively
            $(".ui-dialog-titlebar-close", ui).hide();
        },
        buttons: {
            //define the two button login and cancel
            "Log-in": function() {
                //when login is clicked, we create a user with the data , we emit the object with socket
                //and we close the dialog
                user = new User($("#thepseudoname").val(), $("#theemail").val());
                var obj = JSON.stringify(user);
                socket.emit('login', user);
                $(this).dialog("close");
            },
            Cancel: function() {
                //cancel closes the dialog  
                $(this).dialog("close");
            }
        },
    });

}