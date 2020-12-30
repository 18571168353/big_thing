$(function () {
  $('#link_reg').on('click', function () {
    $('.reg-box').show()
    $('.login-box').hide()
  })
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })
  // 自定义校验规则
  const form = layui.form
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
    repwd: function (value) {
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  // 注册ajax
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    $.post(
      '/api/reguser',
      {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
      },
      function (res) {
        if (res.status !== 0) {
          // return console.log('注册失败', res.message)
          return layer.msg(res.message)
        }
        layer.msg('注册成功，请登录！')
        $('#link_login').click()
      }
    )
  })

  // 登录ajax
  $('#form_login').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('登录成功！')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token', res.token)
        location.href = 'index.html'
      }
    })
  })
})
