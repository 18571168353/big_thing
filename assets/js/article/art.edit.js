$(function () {
  //    console.log( location.search);
  //   let r = location.search.split('?')[1].split('&')
  //   const obj = {}
  //   for (let i = 0; i < r.length; i++) {
  //     let arr = r[i].split('=')
  //     obj[arr[0]] = arr[1]
  //   }
  //   console.log(obj)

  // 封装成一个函数
  const formatParams = (str) => {
    let r = str.split('?')[1].split('&')
    const obj = {}
    for (let i = 0; i < r.length; i++) {
      let arr = r[i].split('=')
      obj[arr[0]] = arr[1]
    }
    return obj
  }
  const obj = formatParams(location.search)
  // console.log(obj);

  // 获取详情数据
  const getArticleDetails = () => {
    $.ajax({
      url: `/my/article/${obj.id}`,
      success(res) {
        console.log(res)
        if (res.status !== 0) return layui.layer.msg('失败')
        // layui.form.val('artEdit',res.data)
        initCate(res.data)
      }
    })
  }
  getArticleDetails()

  var layer = layui.layer
  var form = layui.form
  // initCate()

  // 初始化富文本编辑器
  initEditor()
  // 定义加载文章分类的方法
  function initCate(data) {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要记得调用 form.render() 方法
        form.render()
        layui.form.val('artEdit', data)
        // 富文本编辑器里面没有内容 需要手动添加
        document.querySelector('#content_ifr').contentDocument.querySelector('#tinymce').innerHTML = data.content

        //  渲染当前用户头像
        $image.prop('src', 'http://ajax.frontend.itheima.net' + data.cover_img)
        // 等图片src准确了在渲染
        $image.cropper(options)
      }
    })
  }
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  // $image.cropper(options)

  // 为选择封面的按钮，绑定点击事件处理函数
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })
  // 监听 coverFile 的 change 事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    var file = e.target.files[0]
    // 判断用户是否选择了文件
    if (file.length === 0) {
      return
    }
    var newImgURL = URL.createObjectURL(file)
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })
  // 定义文章的发布状态
  var art_state = '已发布'

  // 为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  // 为表单绑定 submit 提交事件
  $('#form-pub').on('submit', function (e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault()
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0])
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', art_state)
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        // 文章ID
        fd.append('Id',obj.id)
        publishArticle(fd)
      })
  })

  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }
})
