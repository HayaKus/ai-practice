// ==UserScript==
// @name         批量打开网页并点击和截图
// @version      1.0
// @description  手动批量打开预设的网页
// @author       haya
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 网页列表
    var urlsToOpen = [
        'https://www.baidu.com',
        'https://www.baidu.com',
    ];

    // 点击元素
    var clickElement = '点击元素的名称';

    // 截图元素
    var sceenshotElement = '截图元素的名称';

    function openUrlsAndClick() {
        var confirmed = confirm('确认打开预设网页并点击指定坐标吗？');
        if (confirmed) {
            urlsToOpen.forEach(function(url, index) {
                var newWindow = window.open(url, '_blank');
                setTimeout(function() {
                    openNewWindowAndClick(newWindow);
                    takeScreenshotOfElement(newWindow);
                }, 5000); // 等待5秒后执行点击操作
            });
        }
    }

    function openNewWindowAndClick(win) {
        if (win) {
            try {
                var element = win.document.querySelector(clickElement); // 更换为你想要点击的元素选择器
                if (element) {
                    var rect = element.getBoundingClientRect();
                    var x = rect.left + (rect.width / 2);
                    var y = rect.top + (rect.height / 2);

                    var clickEvent = win.document.createEvent('MouseEvents');
                    clickEvent.initMouseEvent('click', true, true, win, 0, x, y, x, y, false, false, false, false, 0, null);
                    element.dispatchEvent(clickEvent);
                } else {
                    alert('未找到指定模块');
                }
            } catch (e) {
                alert('e: ' + e);
            }
        } else {
            alert('无法打开新窗口');
        }
    }

    function takeScreenshotOfElement(win) {
        if (win) {
            try {
                // 获取要截图的模块元素，这里以一个具体的模块选择器为例
                const moduleElement = win.document.querySelector(sceenshotElement); // 替换为目标模块的选择器

                if (!moduleElement) {
                    alert('text: 指定模块未找到!, title: 截图失败');
                    return;
                }

                // 获取模块的位置和大小信息
                const { x, y, width, height } = moduleElement.getBoundingClientRect();

                // 创建一个 Canvas 元素，用于绘制截图
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 设置 Canvas 的大小与模块相同
                canvas.width = width;
                canvas.height = height;

                // 在 Canvas 上绘制指定区域的截图
                ctx.drawImage(
                    document.documentElement,
                    x + window.scrollX,
                    y + window.scrollY,
                    width,
                    height,
                    0,
                    0,
                    width,
                    height
                );

                // 将 Canvas 的内容转换为 Data URL
                const imageDataUrl = canvas.toDataURL('image/png'); // 可以选择图片格式

                // 创建一个虚拟的<a>元素
                const link = document.createElement('a');
                link.href = imageDataUrl;
                link.download = 'module_screenshot.png'; // 下载的文件名

                // 将链接添加到页面中，模拟点击下载
                document.body.appendChild(link);
                link.click();

                // 清理创建的元素
                document.body.removeChild(link);
            } catch (error) {
                alert('截图失败:' + error);
            }
        }
    }


    function addButton() {
        var button = document.createElement('button');
        button.textContent = '打开预设网页并点击';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '8px';
        button.style.backgroundColor = '#3498db';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', openUrlsAndClick);
        document.body.appendChild(button);
    }

    addButton();
})();