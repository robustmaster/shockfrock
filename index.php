<?php
$dir = './'; // 目录路径
$files = glob($dir . '*.html'); // 获取所有html文件

// 按照文件名中的时间信息排序
usort($files, function($a, $b) {
    $pattern = '/\d{8}.\d{6}/'; // 正则表达式匹配时间信息
    preg_match($pattern, $a, $matchesA);
    preg_match($pattern, $b, $matchesB);

    $timeA = DateTime::createFromFormat('Ymd.His', $matchesA[0]);
    $timeB = DateTime::createFromFormat('Ymd.His', $matchesB[0]);

    return $timeB <=> $timeA; // 降序排序
});

$groupedFiles = []; // 按年份分组存储文件
foreach ($files as $file) {
    $pattern = '/\d{4}/'; // 正则表达式匹配年份
    preg_match($pattern, $file, $matches);
    $year = $matches[0];

    if (!isset($groupedFiles[$year])) {
        $groupedFiles[$year] = [];
    }

    $groupedFiles[$year][] = $file;
}

// 输出HTML页面
echo '<html>';
echo '<head>';
echo '<title>HTML文件列表</title>';
echo '<style>
    body {
        font-family: Arial, sans-serif;
        text-align: center; /* 页面内容居中 */
    }
    h2 {
        text-align: center; /* 分组名称居中 */
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
    @media screen and (min-width: 768px) {
        /* 在较大屏幕上居中显示 */
        body {
            max-width: 800px;
            margin: 0 auto;
        }
    }
    </style>'; // 页面样式
echo '</head>';
echo '<body>';

foreach ($groupedFiles as $year => $yearFiles) {
    echo '<h2>' . $year . '年</h2>'; // 年份标题

    echo '<ul>';
    foreach ($yearFiles as $file) {
        $pattern = '/\d{8}.\d{6}.(.*).html/'; // 正则表达式匹配标题
        preg_match($pattern, $file, $matches);
        $title = $matches[1];

        $pattern = '/(\d{4})(\d{2})(\d{2}).(\d{2})(\d{2})(\d{2})/'; // 正则表达式匹配日期
        preg_match($pattern, $file, $matches);
        $date = $matches[1] . '-' . $matches[2] . '-' . $matches[3];

        echo '<li><a href="' . $file . '">' . $title . '</a><span class="date">' . $date . '</span></li>'; // 文件标题、超链接和日期
    }
    echo '</ul>';
}

echo '</body>';
echo '</html>';
?>
