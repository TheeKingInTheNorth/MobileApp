/**
 * Created by mitchellkurman on 9/23/16.
 */

$(document).ready(function() {
    AWS.config.accessKeyId = 'AKIAJTEYUG7SS5WKTFOQ';
    AWS.config.secretAccessKey = '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';
    AWS.config.region = 'us-east-1';
    /*Show image from s3 bucket named as yu-app with open permissions
    * To DO: externalize the url and dynamically retrieve the image key
    * */
    var isPicViewable = false;
    $('#showpicbutton').click(function () {
        if(!isPicViewable) {
            $('#showpic').append("<img src='http://yu-app.s3.amazonaws.com/test/kids.jpg' alt='kids'>");
            isPicViewable = true;
        }
    });
/*
 curl -X PUT --data-binary "@/Users/mitchellkurman/Desktop/Cruise.jpeg" -H "Content-Type: image/jpeg" -H "x-amz-acl: public-read-write" http://yu-app.s3.amazonaws.com/test/Cruise.jpeg
 */

    $('#add-record-form').submit(function(e){
        //alert('hi');
        e.preventDefault();
       // alert('entered ajax: '+ e.target.id + ' parentNode:'+ );
       // alert("entered ajax: "+ $("#add-record-form #imageKey").val().split("\\").pop());
       // console.log($("#add-record-form #imageKey").val().split("\\").pop());

        //var theFormFile = $('#theFile').get()[0].files[0];
        var filename = $('#add-record-form #imageKey').val().split('\\').pop();


        $.ajax({
            url: 'http://yu-app.s3.amazonaws.com/test/'+filename, // url where to submit the request
            headers: {
                'Content-Type':'image/jpeg'
            },
            type: 'PUT', // type of action POST || GET
            processData: false,
            //using dataType of response type xml will return null when a PUT is successful.
            dataType: 'xml',
            data: $('#imageKey').get()[0].files[0], // post data || get data
            success: function () {
                //result will be null when successful but the success option will be executed.
                console.log($('#imageKey'));
                //alert("Success: "+ $('#imageKey').get()[0].files[0].name);
                /*
                Add record to dynamodb
                 */
                var recordId = $('#recordId').val();
                var episode = $('#episode').val();
                var description = $('#Description').val();
                var imageKey = $('#imageKey').get()[0].files[0].name;
                var title = $('#title').val();
                var rating = $('#rating').val();
                //alert('{"recordId":"'+recordId+'","description":"'+ description+'","episode":"'+episode+'","imageKey":"'+imageKey+'","rating":"'+rating+'","title":"'+title+'"}');
                $.ajax({
                    url: 'https://oq88q01z9j.execute-api.us-east-1.amazonaws.com/prod/yu-anime-record',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    type: 'POST',
                    processData: false,
                    dataType: 'json',
                    data: '{"recordId":"'+recordId+'","description":"'+ description+'","episode":"'+episode+'","imageKey":"'+imageKey+'","rating":"'+rating+'","title":"'+title+'"}',
                    success: function (e) {
                        alert ('success');
                        console.log(e);
                        $("#add-record-form").trigger("reset");
                    },
                    error: function (xhr, resp, text) {
                        console.log(xhr, resp, text);
                    }
                })
            },
            error: function (xhr, resp, text) {
                console.log(xhr, resp, text);
            }
        });
        return true;
    });


})