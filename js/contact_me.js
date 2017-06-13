$(function () {

    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function ($form, event) {
            // Prevent spam click and default submit behaviour
            $("#btnSubmit").attr("disabled", true);
            event.preventDefault();

            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            console.log("Is here");
            Email.send("cardonaangelo@hotmail.com",
            "angelocardona85@gmail.com",
            "Website Contact Form: " + name,
            "You have received a new message from your website contact form.\n\nHere are the details:\n\nName: " +
            firstName + "\n\nEmail: " + email + "\n\nPhone: "+phone+"\n\nMessage:\n"+message,
            {token: "b1deecdb-642b-43a4-af0b-a750c2811454"});

            //Email.send("cardonaangelo@hotmail.com",
            //"to@them.com",
            //"This is a subject",
            //"this is the body",
            //"smtp.yourisp.com",
            //"username",
            //"password");


        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

// When clicking on Full hide fail/success boxes
$('#name').focus(function () {
    $('#success').html('');
});