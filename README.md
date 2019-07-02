# Time-management-checklist
微信小程序云开发-时间管理清单

doc里放的是文档，src里放的是微信小程序的一整个项目。（文档也请提交到GitHub）

commit的时候用自己的分支，commit完了之后pull request；pull的时候用master分支，别搞混了。

pull request 和pull 一点关系都没有，这个pull request指的是request别人pull你的修改，本质上是一个上传请求，请求与master分支合并。

如果在你上一次pull代码下来之后master分支没有过任何commit，最好直接提交到master分支，否则我要花大量时间做几乎没意义的merge。

github desktop使用教程：

github desktop:add->clone repository 

github desktop:clone NS-Tang/Time-management-checklist到本地，本地路径不要有中文

github desktop:在current branch选自己的名字缩写的branch（已建好）
微信开发者工具:在微信开发者工具中导入项目，路径为你刚才clone下来的路径的src文件夹，这样就可以导入了。

文件资源管理器:文档放到本地的doc文件夹，里面有三次迭代的分别三个或四个个文档的文件夹，文件夹下有个.txt文件名指明这个文件夹装什么的。（已放好，直接在这下面改就行了）

github desktop:做任何修改后，在自己的 branch下点击commit,需要输入一个summary，指明此次修改的概要。

commit成功后点击右边的pull request



第三次迭代需求：（按要紧程度排序）（持续关注，可能更新）

行事历中添加事项能在日历中显示（颜色变化之类，推荐与日历点击标记和当日标记形式相同，颜色为红色）

任务清单用来显示最近的有限个（固定行数）或全部（带滚轮）事项，按时间紧迫程度排序，时间一过，对应事项消失

添加内容变多包扩事项等级或事项分组（日历、个人、工作），事项分组在日历中及任务清单中有图标显示

添加「我的」界面，功能：显示头像（账号），清空数据库，小程序退出功能。

数据上传到数据库，并能正确下载。（具体触发事件待定（增删改查即时触发、小程序进入退出触发）若即时触发则要紧程度排到第一）
 
周期添加即批量添加（起始时间，截止时间，周期）  
 
 实现所有事项的到期通知功能
 
 第三个界面其它功能待加入（比如高考倒计时）
