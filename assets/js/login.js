$(function() {
    // 点击 “去注册账号” 的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide(); // 隐藏
        $('.reg-box').show(); // 显示
    });

    // 点击 “去登陆” 的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide(); // 隐藏
        $('.login-box').show(); // 显示
    })


    // 从 layui 中获取对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify() 自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [
            /^[\Sa-zA-Z_]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function(value) {
            // 通过形参拿到的时确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd != value) {
                return '两次密码不一致!';
            }
        },
        username: function(value) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        }

    });
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 1. 先阻止默认的提交行为
        e.preventDefault();
        let data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        // 2. 再发起 ajax 的 post 请求 
        $.post('/api/reguser', data,
            function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功！请登录');
                // 触发登录的点击事件
                $('#link_login').click();
            })
    })

    // 监听登录表单的提交时间
    $('#form_login').submit(function(e) {
        // 1. 先阻止默认的提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // serialize() 快速获取表单的提交数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // 将登陆成功得到的 token 字符串保存到 localStorage
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html';
            }
        })
    })
})