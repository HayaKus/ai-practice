// ==UserScript==
// @name         大促批量截图
// @version      1.0
// @description  手动批量打开预设的网页
// @author       哈雅
// @match        https://www.baidu.com
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
    var clickElement = 'i.c-icon.hotsearch-title';

    // 截图元素
    var sceenshotElement = 's_main.main.clearfix.c-wrapper.c-wrapper-l';

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

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function takeScreenshot(win) {
        var document = win.document;
        const pageWidth = Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth);
        const pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

        const canvas = document.createElement('canvas');
        canvas.width = pageWidth;
        canvas.height = pageHeight;

        const context = canvas.getContext('2d');

        const screenshotItems = [];
        let yOffset = 0;
        while (yOffset < pageHeight) {
            window.scrollTo(0, yOffset);
            await sleep(10000); // Adjust the delay if needed
            screenshotItems.push({
                yOffset: yOffset,
                data: context.getImageData(0, yOffset, pageWidth, Math.min(pageHeight - yOffset, window.innerHeight))
            });
            yOffset += window.innerHeight;
        }

        screenshotItems.forEach(item => {
            context.putImageData(item.data, 0, item.yOffset);
        });

        const dataURL = canvas.toDataURL('image/png');

        // Create a temporary link element to download the screenshot
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'full-page-screenshot.png';
        link.click();
    }

    async function takeScreenshotOfElement(win) {
        if (win) {
            try {
                await takeScreenshot(win);
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