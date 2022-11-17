# Django 學習筆記


環境架設
===

* django 1.11.15
* python 3.5

---

新增專案
===
```python
$ django-admin startproject dehweb
$ python manage.py startapp mysite
```
##### 進入資料夾
```python
cd dehweb
```

#### 建立app
```python
$ python manage.py startapp mysite
```



---

套件安裝
===
* 取得==pip==

複製 [pip](https://bootstrap.pypa.io/get-pip.py) 存成.py檔 執行一次就可使用

* 取得==git==

[click here](https://git-for-windows.github.io/) 安裝後即可使用

* 第三方服務寄電子郵件
```python=
pip install django-mailgun
```

setting.py
```python=
EMAIL_BACKEND = 'django_mailgun.MailgunBackend'
MAILGUN_ACCESS_KEY = 'key-c6c1983644c4de779cc16f909896c89e'
MAILGUN_SERVER_NAME = 'sandboxbbe3d4b5739640999c958cfd64ed85f3.mailgun.org'
```
上面三種內容可到mailgun網頁找到

* 自動化註冊
```python
$ pip install django-registration==3.0.1
```
setting.py
```python
 ACCOUNT_ACTIVATION_DAYS = 7 #(一般為7天)
```
url.py
```python
 url(r'^accounts/',include('registration.backends.hmac.urls')),
```

* 上傳照片套件
```python
$ pip install django-filter==2.2.0
```
* 群組管理排程套件
```python
pip install apscheduler==2.1.2
```
setting.py
```python=
 'easy_thumbnails','filter','mptt' #加在INSTALLED_APPS
 THUMBNAIL_HIGH_RESOLUTUION =True
 #filer 路徑設定須設對
```

```python=
$ pip install django-simple-captcha==0.5.12
$ pip install easy-thumbnails==2.7
$ pip install django-filer==1.7.0
```

設定login [MD5加密方法](https://docs.djangoproject.com/en/1.10/topics/auth/passwords/)


---


model
===

[select_relate](https://docs.djangoproject.com/en/1.10/ref/models/querysets/)

[Difference between select_related and prefetch_related in Django](http://stackoverflow.com/questions/31237042/whats-the-difference-between-select-related-and-prefetch-related-in-django-orm)

> 根據這個解說 Select_related 是一個query, Prefach_related 是多個query
> 所以要用Manytomany relation 要用後者

[select_related example](http://stackoverflow.com/questions/12974352/django-queryset-and-select-related)

[prefetch_related example](http://stackoverflow.com/questions/27121331/select-related-after-prefetch-related)

---

view
===

自訂[login require](http://stackoverflow.com/questions/2164069/best-way-to-make-djangos-login-required-the-default)方法

---

url
===
---

template
===

### header.html
```htmlmixed=
<link rel="shortcut icon" type="image/png" href="{{STATIC_URL}}/favicon.ico"/>
```

---

[MSSQL 資料庫同步](https://docs.djangoproject.com/en/1.10/ref/databases/)
===
```
1.微軟先安裝`odbc driver 13.0.0.0`
2.`$ pip install pyodbc==4.0.27` 
3.`$ pip install django-pyodbc-azure==1.11.15.0`
```
4. setting.py 設定:
```python=
DATABASES = {
    'default': {
        'NAME':'MOE3',
        'ENGINE': 'sql_server.pyodbc',
        'HOST': 'your_ip',
        'USER': 'account',
        'PASSWORD': 'password',
        'OPTIONS': {
            'driver': 'ODBC Driver 13 for SQL Server',
        }
    }
}
```
## 如果是使用Linux
需要先安裝python setuptools, unixODBC,然後上微軟安裝odbc driver 13.0.0.0


3. 同步db
`$　python manage.py inspectdb`

4. 此時會產生manage.py檔 用它把data轉到 model.py
`$ python manage.py inspectdb > models.py`

---


參考網站
===
[Group](https://docs.djangoproject.com/en/1.10/topics/db/models/#extra-fields-on-many-to-many-relationships)

[使用者互動與表單](http://dokelung-blog.logdown.com/posts/220833-django-notes-7-forms)

[多個檔案上傳](https://docs.djangoproject.com/en/1.10/topics/http/file-uploads/)

[詳細Django資訊](http://dokelung-blog.logdown.com/)

[多方資訊](http://ithelp.ithome.com.tw/articles/10161594)

[別人的範本1](https://github.com/JCarlosR/DjangoSqlServ)

---

##### `django` `python`







