import os
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from starlette.responses import FileResponse

app = FastAPI()

path = os.getcwd()
html_file_names = [filename for filename in os.listdir(path) if filename.endswith('.html')]

html_li_tags = ''
for html_file_name in sorted(html_file_names, reverse=True):
    title = html_file_name.split('.')[2]
    date = html_file_name.split('.')[0]
    formatted_date = date[:4] + "-" + date[4:6] + "-" + date[6:]
    html_li_tags += '<li><a href="' + html_file_name + '">' + title + '</a><span class="date">' + formatted_date + '</span></li>'

@app.get("/")
def read_root():
    return HTMLResponse(index_html_template)

@app.get('/{html_file_name}')
async def read_html(html_file_name: str):
    return FileResponse(html_file_name)

index_html_template ="""
<html>
<head>
<title>小报</title>
<style>
    body {
        font-family: Arial, sans-serif;
        text-align: left; /* 分组名称靠左显示 */
        margin: 0; /* 清除默认的页面边距 */
    }
    h1 {
        text-align: center; /* 页面标题居中 */
        margin-top:20px;
    }
    h2 {
        margin-top: 20px; /* 分组标题与页面标题之间的间距 */
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: flex;
        justify-content: space-between;
        color: black; /* 文件标题黑色显示 */
        padding: 5px;
    }
    .date {
        color: #808080; /* 日期灰色显示 */
    }
    .small-font {
        font-size: 14px; /* 较小的字体大小 */
        text-align:center;
    }
    
    /* 响应式布局 */
    @media screen and (min-width: 768px) {
        /* 在较大屏幕上居中显示 */
        body {
            max-width: 800px;
            margin: 0 auto;
        }
    }
    </style> 
</head>
<body>

<h1>小报</h1>
<ul>""" + html_li_tags + """
</ul>
</body>
</html>
"""
