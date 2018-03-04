//document on ready();
$(function () {
    //textare Chk bytes...
    var textCountLimit = 200;

    $('#textarea').bind('keyup', function () {
        var textLength = $(this).val().length;

        $('#str').text(textLength);

        if (textLength > textCountLimit) {
            $(this).val($(this).val().substr(0, textCountLimit));
        }
    });

    //SearchBar func
    $('#sform').submit(function (event) {
        console.log('SearchForm submit');
        event.preventDefault();

        var str = $('#search').html();
        if (str == null) return false;
        console.log($.md5(str));

        var form = $(this);
        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: str,
            success: function (result) {
                console.log('success');
            },
            error: function (err) {
                console.log('err');
            }
        });
    });

    //user Comment submit
    $('#usrForm').submit(function (target) {
        console.log('userForm submit');
        event.preventDefault();

        var grade = $('#usrForm .grade');
        var error = false;

        for (item of grade) {
            var html = item.outerText;
            html *= 10;
            error = html == 0;
        }

        var str = $('#str').html() * 1;
        error = str == 0;
        if (str === 0)
            alert("코멘트를 입력해 주세요.");


        if (error) return false;

        this.submit();
    });


    $('.page_lst a').bind('click', function (event) {
        event.preventDefault();

        var items = $('.page_lst a');
        console.log(event.target);
        console.log(items);
        for (item of items) {
            $(item).removeAttr('Active');
        }
        $(event.target).attr('Active', 'true');
    });


    //rating half star
    $('.rate').rateYo({
        rating: 0,
        starWidth: '13px',
        ratedFill: '#F54A62',
        halfStar: true
    });


    $('.rate').bind('click', function (event) {
        var grade=$(this).parent().find('.grade');
        console.log(grade);
        grade.html($(this).rateYo('rating'));
    });
});
