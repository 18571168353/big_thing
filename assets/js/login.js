$(function (){
    $('#link_reg').on('click',function(){
        $('.reg-box').show()
        $('.login-box').hide()
    })
    $('#link_login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })
})