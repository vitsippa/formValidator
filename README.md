# formValidator
form验证器
## features
1. 可自定义验证
2. 可自定义验证结果显示样式
3. 灵活的验证器配置方式
4. 满足大多数form使用场景

## usage
### 配置
可使用js或HTML data属性进行配置。这两种方法可以混合使用

#### 配置方式1:JS配置
见[demo1](https://github.com/vitsippa/formValidator/blob/master/demo/demo1.html)

#### 配置方式2:HTML配置
见[demo2](https://github.com/vitsippa/formValidator/blob/master/demo/demo2.html)

#### 配置方式混合使用
见[demo3](https://github.com/vitsippa/formValidator/blob/master/demo/demo3.html)

#### 配置参数说明

##### JS配置参数
1. `form` 必须 需要被验证的form
2. `onValidated` 可选 类似于form的onsubmit事件.onValidated 仅在所有`require`验证通过后被调用
3. `queue` 可选 对象数组。对象结构：
    * `tag` 必须 需要被验证的input。
    * `event` 可选 触发验证的事件，默认为'blur'。
    * `validator` 必须 验证器.可以为字符串或正则。支持的字符串分别是：`empty`,`email`,`number`,`float`
    * `cb` 可选 `tag`验证后的回调函数。回调函数有4个参数，分别是：`tag`, `event`, `isMatch`, `param`
    * `require` 可选 如果设置为true，则sumbit的时候必须要求该项通过验证。默认false
    * `errorMsg` 可选 错误消息。支持变量(可[自定义错误消息解析](#自定义错误消息解析))：
        * `{val}` input的值
        * `{len}` input的值的长度

##### HTML配置参数
HTML配置使用data属性。

1. `data-validator` 必须 验证器.可以为字符串或正则。支持的字符串分别是：`empty`,`email`,`number`,`float`或[自定义字符串](#自定义字符串验证)
2. `data-event` 可选 触发验证的事件，默认为'blur'。
2. `data-require` 可选 如果设置为true，则sumbit的时候必须要求该项通过验证。默认false
2. `data-errorMsg` 可选 错误消息。支持变量(可[自定义错误消息解析](#自定义错误消息解析))：
   * `{val}` input的值
   * `{len}` input的值的长度

### 自定义显示结果
见[demo4](https://github.com/vitsippa/formValidator/blob/master/demo/demo4.html)

### 自定义验证器
#### 自定义字符串验证
见[demo5](https://github.com/vitsippa/formValidator/blob/master/demo/demo5.html)

#### 自定义函数验证
见[demo6](https://github.com/vitsippa/formValidator/blob/master/demo/demo6.html)

### 验证成功后回调函数
见[demo7](https://github.com/vitsippa/formValidator/blob/master/demo/demo7.html)

### 自定义错误消息解析
见[demo8](https://github.com/vitsippa/formValidator/blob/master/demo/demo8.html)
