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
            $.ajax({
                url: "https://api.dropboxapi.com/2/files/create_folder",
                type: "POST",
                headers: {
                    'authorization': 'Bearer lucQoFMD08AAAAAAAABGPBWPwZbM7eySRpJ0bfJEl3DR0rd4NC-Z-NpY3-19gZah',
                    'Content-Type': 'application/json',
                },

                data: JSON.stringify({
                    "path": "/"+name,
                    "autorename": false
                }),
                cache: false,
                success: function (ans) {
                    console.log(ans);
                },
                error: function (e) {
                    console.log(e);
                }
            });
            Email.send("cardonaangelo@hotmail.com",
                "angelocardona85@gmail.com",
                "Website Contact Form: " + name,
                "You have received a new message from your website contact form.\n\nHere are the details:\n\nName: " +
                firstName + "\n\nEmail: " + email + "\n\nPhone: " + phone + "\n\nMessage:\n" + message, {
                    token: "81a69393-0849-487a-a959-1c388ca7801c"
                });

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