

// 当表单发生提交行为的时候
$('#userForm').on('submit',function() {
    var formData = $(this).serialize();
    // 向服务器端发送添加用户请求
    $.ajax({
        type: 'post',
        url: '/users',
        data: formData,
        success: function(response) {
            // 刷新页面
            location.reload();
        },
        error: function(response) {
            alert('用户添加失败');
            console.log(response);
        }
    })
    return false;
})


// 图片上传
$('#modifyBox').on('change', '#avatar', function () {
	console.log(this.files[0])
	// 用户选择的文件
    var formData = new FormData();
	formData.append('avatar', this.files[0]);

    // console.log(this.files.accept);
	$.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        // 告诉ajax方法不要 解析请求参数
        processData: false,
        // 告诉ajax方法不要 设置请求参数的类型
        contentType: false,
        success: function(response) {
            console.log(response);
            $('#preview').attr('src', response[0].avatar);
            $('#hiddenAvatar').val(response[0].avatar);
        },
        error: function(response) {
            var message = JSON.parse(response.responseText).message;
            alert(message)
        }
    })
})

$.ajax({
    type: 'get',
    url: '/users',
    success: function(response) {
        // 用户列表模板
        var userTpl = `
        {{each data}}
        <tr>
          <td class="text-center">
            <input type="checkbox" class="userStatus" data-id="{{$value._id}}">
          </td>
          <td class="text-center">
            {{if $value.avatar}}
            <img class="avatar" src="{{$value.avatar}}" alt="">
            {{/if}}
          </td>
          <td>{{$value.email}}</td>
          <td>{{$value.nickName}}</td>
          <td>{{$value.status == 0 ? '未激活' : '激活'}}</td>
          <td>{{$value.role == 'admin' ? '管理员' : '普通用户'}}</td>
          <td class="text-center">
            <a href="javascript:;" class="btn btn-default btn-xs edit" data-id="{{$value._id}}">编辑</a>
            <a href="javascript:;" class="btn btn-danger btn-xs delete" data-id="{{$value._id}}">删除</a>
          </td>
        </tr>
        {{/each}}`
        var html = template.render(userTpl, {
            data: response
        })

        //将拼接好的字符串显示在页面中
        $('#userBox').html(html);
    }
})

// 通过事件委托的方式为编辑按钮添加点击事件
$('#userBox').on('click', '.edit', function() {
    // 根据被点击的用户的id值
    var id = $(this).attr('data-id')
    // 根据id获取用户的详细信息
    $.ajax({
        type: 'get',
        url: '/users/' + id,
        success: function(response) {
            // 用户信息修改模板
            var modifyTpl = `
            <form id="modifyForm" data-id="{{_id}}">
            <h2>修改用户信息</h2>
            <div class="form-group">
              <label>头像</label>
              <div class="form-group">
                <label class="form-image">
                  <input id="avatar" type="file" accept="image/jpeg, image/png">
                  {{if avatar}}
                  <img src="{{avatar}}" id="preview">
                  {{else}}
                  <img src="../assets/img/default.png" id="preview">
                  {{/if}}
                  <i class="mask fa fa-upload"></i>
                </label>
                <input type="hidden" name="avatar" id="hiddenAvatar">
              </div>
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input value="{{email}}" class="form-control" type="email" placeholder="请输入邮箱" name="email">
            </div>
            <div class="form-group">
              <label>昵称</label>
              <input value="{{nickName}}" class="form-control" type="text" placeholder="请输入昵称" name="nickName">
            </div>
            <div class="form-group">
              <div class="radio-inline">
                <label><input type="radio" name="status" value="0" {{status == 0 ? 'checked' : ''}}>未激活</label>
              </div>
              <div class="radio-inline">
                <label><input type="radio" name="status" value="1" {{status == 1 ? 'checked' : ''}}>激活</label>
              </div>
            </div>
            <div class="form-group">
              <div class="radio-inline">
                <label><input type="radio" name="role" value="admin" {{role == 'admin' ? 'checked' : ''}}>超级管理员</label>
              </div>
              <div class="radio-inline">
                <label><input type="radio" name="role" value="normal" {{role != 'admin' ? 'checked' : ''}}>普通用户</label>
              </div>
            </div>
            <div class="form-group">
              <button class="btn btn-primary" type="submit">修改</button>
            </div>
          </form>`
            let html = template.render(modifyTpl, response);
            $('#modifyBox').html(html)
        }
    })
})


// 通过事件委托的方式为修改按钮添加点击事件
$('#modifyBox').on('submit', '#modifyForm', function() {
    // 获取用户在表单中输入的内容
    var formData = $(this).serialize();
    // 获取要修改的那个用户id值
    var id = $(this).attr('data-id');
    // 发送请求 修改用户信息
    $.ajax({
        type: 'put',
        url: '/users/' + id,
        data: formData,
        success: function(response) {
            // console.log(response);
            // console.log(formData);
            location.reload();
        },
        error: function(response) {
            console.log(response);
        }
    })
   return false;
})


// 当删除按钮被点击时
$('#userBox').on('click', '.delete', function() {
    // 如果管理员确定要删除
    if (confirm('确定要删除用户吗')) {
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function(response) {
                console.log(response);
                location.reload();
            },
            error: function(response) {
                console.log(response);
            }
        })
    }
})

// 获取全选按钮
var selectAll = $('#selectAll');
// 获取批量删除按钮
var deleteMany = $('#deleteMany');
// 当全选按钮的状态发生改变时
selectAll.on('change', function() {
    // 获取到全选按钮当前的状态
    var status = $(this).prop('checked');
    if (this.checked) {
        deleteMany.show();
    } else {
        deleteMany.hide();
    }
    // 获取到所有的用户并将用户的状态的全选按钮保持一致
    $('#userBox').find('input').prop('checked', status);
})

// 当用户前面的复选框状态发生改变时
$('#userBox').on('change', '.userStatus', function() {
    // 获取到所有用户 在所有用户中过滤出选中的用户
    // 判断选中的用户的数量和所有用户的数量是否一致
    // 如果一致 就说明所有的用户都是选中状态
    // 否则 就是有用户没有选中
    var inputs = $('#userBox').find('input');

    if (inputs.length == inputs.filter(':checked').length) {
        // alert('所有用户都是选中状态')
        selectAll.prop('checked', true);
    } else {
        // alert('不是全选状态')
        selectAll.prop('checked', false)
    }

    // console.log(inputs.filter(':checked').length);

    // 如果选中的复选框的数量大于1 就说明有选中的用户
    if(inputs.filter(':checked').length > 1) {
        // 显示批量删除按钮
        deleteMany.show();
    } else {
        // 隐藏批量删除按钮
        deleteMany.hide();
    }
})

// 为批量删除按钮添加点击事件
deleteMany.on('click', function() {
    var ids = [];
    // 获取选中的用户
    var checkedUser = $('#userBox').find('input').filter(':checked')
    checkedUser.each(function (index, element) {
        ids.push($(element).attr('data-id'))
    })
    // console.log(ids);
    // console.log(ids.join('-'));
    if (confirm('确定要删除操作吗？')) {
        $.ajax({
            type: 'delete',
            url: '/users/' + ids.join('-'),
            success: function(response) {
                console.log(response);
                location.reload();
            }
        })
    }
})