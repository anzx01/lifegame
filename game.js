// 我还能撑多久？ - 黑色幽默生存模拟游戏
// Copyright (c) 2026 anzx01
// Licensed under the MIT License - https://opensource.org/licenses/MIT

// 游戏状态
let gameState = {
    cash: 5,
    stress: 50,
    dignity: 70,
    identity: 70,
    level: 1,
    antiVision: null,
    moments: [],
    maxStress: 50,
    initialCash: 5
};

// 事件池
const eventPool = {
    1: [ // 第1关：日常小确丧
        {
            title: "房租涨价",
            desc: "房东突然通知你,下个月房租涨20%。理由是\"市场行情\"。",
            choices: [
                { text: "忍了,继续租", impact: { stress: 5 } },
                { text: "搬家找便宜的", impact: { cash: -0.5, dignity: -5 } },
                { text: "跟房东讨价还价", impact: { identity: -3 } }
            ]
        },
        {
            title: "副业被坑",
            desc: "你投入的副业项目突然跑路,血本无归。",
            choices: [
                { text: "认栽,吸取教训", impact: { cash: -1, stress: 10 } },
                { text: "报警追回", impact: { stress: 15, dignity: -5 } },
                { text: "找朋友借钱", impact: { cash: 0.5, dignity: -10 } }
            ]
        }
    ],
    2: [ // 第2关：突发黑天鹅
        {
            title: "突然生病",
            desc: "你感觉身体不适,去医院检查需要一笔不小的费用。",
            choices: [
                { text: "借钱看病", impact: { cash: -1, stress: 15 } },
                { text: "硬扛着", impact: { stress: 20, dignity: -10 } },
                { text: "求助亲友", impact: { cash: 0.5, identity: -10 } }
            ]
        },
        {
            title: "设备损坏",
            desc: "你的工作电脑突然坏了,需要紧急更换。",
            choices: [
                { text: "买新的", impact: { cash: -1.5 } },
                { text: "修旧的凑合", impact: { stress: 10 } },
                { text: "向公司申请", impact: { dignity: -5 } }
            ]
        }
    ],
    3: [ // 第3关：职场阴间
        {
            title: "降薪通知",
            desc: "老板突然宣布降薪20%,理由是\"公司困难\"。但你看到他刚换了新车...",
            choices: [
                { text: "忍气吞声,继续干", impact: { stress: 15 } },
                { text: "跳槽找新工作", impact: { cash: Math.random() > 0.5 ? 1.5 : -1 } },
                { text: "舔老板保住工作", impact: { dignity: -15, identity: 5 } }
            ]
        },
        {
            title: "奖金泡汤",
            desc: "年终奖金被克扣,理由是\"绩效不达标\"。",
            choices: [
                { text: "接受现实", impact: { stress: 10 } },
                { text: "据理力争", impact: { stress: 20, dignity: 5 } },
                { text: "准备离职", impact: { stress: 15 } }
            ]
        }
    ],
    4: [ // 第4关：心理爆炸
        {
            title: "失眠焦虑",
            desc: "连续失眠一周,白天精神恍惚,工作效率直线下降。",
            choices: [
                { text: "吃安眠药", impact: { stress: -20, dignity: -10 } },
                { text: "去夜店放松", impact: { identity: -10, cash: -0.5 } },
                { text: "向朋友倾诉", impact: { stress: -10 } }
            ]
        },
        {
            title: "相亲失败",
            desc: "家人安排的相亲,对方嫌你条件差,当场拒绝。",
            choices: [
                { text: "自我安慰", impact: { stress: 15 } },
                { text: "发奋改变", impact: { stress: 10, dignity: 5 } },
                { text: "破罐破摔", impact: { dignity: -15 } }
            ]
        }
    ],
    5: [ // 第5关：极限压力
        {
            title: "裁员危机",
            desc: "公司开始裁员,你的部门首当其冲。",
            choices: [
                { text: "梭哈副业", impact: { cash: Math.random() > 0.7 ? 3 : -2 } },
                { text: "卖身求职", impact: { dignity: -30, cash: 2 } },
                { text: "躺平摆烂", impact: { identity: -30 } }
            ]
        },
        {
            title: "房贷催缴",
            desc: "银行催缴房贷,再不还就要拍卖房子。",
            choices: [
                { text: "借高利贷", impact: { cash: 2, stress: 30 } },
                { text: "卖房还债", impact: { cash: 5, identity: -20 } },
                { text: "跑路躲债", impact: { identity: -40, dignity: -20 } }
            ]
        }
    ],
    6: [ // 第6关：越线前夜
        {
            title: "债主上门",
            desc: "欠的钱还不上,债主找上门来威胁。",
            choices: [
                { text: "报警求助", impact: { stress: 20, dignity: -10 } },
                { text: "跪地求饶", impact: { dignity: -30, stress: -10 } },
                { text: "铤而走险", impact: { cash: Math.random() > 0.5 ? 5 : -5, identity: -30 } }
            ]
        }
    ],
    7: [ // 第7关：终极求生
        {
            title: "最后抉择",
            desc: "走投无路,你必须做出最后的选择。",
            choices: [
                { text: "重新开始", impact: { stress: -20, dignity: 10 } },
                { text: "彻底放弃", impact: { dignity: -50 } },
                { text: "孤注一掷", impact: { cash: Math.random() > 0.5 ? 10 : -10 } }
            ]
        }
    ]
};

// 显示屏幕
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// 开始游戏
function startGame() {
    // 读取输入值
    gameState.cash = parseFloat(document.getElementById('initialCash').value);
    gameState.initialCash = gameState.cash;
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
    const monthlyExpense = parseFloat(document.getElementById('monthlyExpense').value);
    gameState.identity = parseInt(document.getElementById('identityValue').value);

    // 计算初始压力
    gameState.stress = Math.max(0, Math.min(100, (monthlyExpense - monthlyIncome) * 20 + 30));
    gameState.dignity = 70;
    gameState.level = 1;
    gameState.moments = [];
    gameState.maxStress = gameState.stress;

    showScreen('antiVisionScreen');
}

// 选择反愿景
function selectAntiVision(type) {
    gameState.antiVision = type;
    showScreen('gameScreen');
    loadLevel();
}

// 加载关卡
function loadLevel() {
    // 掷骰子
    const dice = Math.floor(Math.random() * 6) + 1;
    document.getElementById('diceText').textContent = `🎲 运气: ${dice}`;
    document.getElementById('levelText').textContent = `第${gameState.level}关/7`;

    // 随机选择事件
    const levelEvents = eventPool[gameState.level];
    const event = levelEvents[Math.floor(Math.random() * levelEvents.length)];

    // 显示事件
    document.getElementById('eventTitle').textContent = event.title;
    document.getElementById('eventDesc').textContent = event.desc;

    // 显示选项
    event.choices.forEach((choice, index) => {
        const labels = ['A', 'B', 'C'];
        document.getElementById(`choice${labels[index]}`).textContent = choice.text;

        // 显示影响
        const impactText = getImpactText(choice.impact);
        const impactEl = document.getElementById(`impact${labels[index]}`);
        impactEl.textContent = impactText.text;
        impactEl.className = 'choice-impact ' + impactText.class;
    });

    // 保存当前事件
    gameState.currentEvent = event;

    // 更新仪表盘
    updateDashboard();
}

// 获取影响文本
function getImpactText(impact) {
    if (impact.stress) {
        return { text: `💣${impact.stress > 0 ? '+' : ''}${impact.stress}`, class: 'stress' };
    }
    if (impact.dignity) {
        return { text: `👑${impact.dignity > 0 ? '+' : ''}${impact.dignity}`, class: 'dignity' };
    }
    if (impact.identity) {
        return { text: `🪞${impact.identity > 0 ? '+' : ''}${impact.identity}`, class: 'identity' };
    }
    if (impact.cash !== undefined) {
        if (typeof impact.cash === 'number') {
            return { text: `💰${impact.cash > 0 ? '+' : ''}${impact.cash}万`, class: 'cash' };
        } else {
            return { text: '💰+?', class: 'neutral' };
        }
    }
    return { text: '', class: '' };
}

// 做出选择
function makeChoice(index) {
    const choice = gameState.currentEvent.choices[index];
    const impact = choice.impact;

    // 应用影响
    if (impact.cash !== undefined) {
        gameState.cash += impact.cash;
    }
    if (impact.stress) {
        gameState.stress = Math.max(0, Math.min(100, gameState.stress + impact.stress));
        gameState.maxStress = Math.max(gameState.maxStress, gameState.stress);
    }
    if (impact.dignity) {
        gameState.dignity = Math.max(0, Math.min(100, gameState.dignity + impact.dignity));
    }
    if (impact.identity) {
        gameState.identity = Math.max(0, Math.min(100, gameState.identity + impact.identity));
    }

    // 记录耻辱时刻
    if (impact.dignity && impact.dignity < -10) {
        gameState.moments.push({
            level: gameState.level,
            title: gameState.currentEvent.title,
            choice: choice.text,
            impact: getImpactText(impact).text
        });
    }

    // 添加动画效果
    document.querySelector('.dashboard').classList.add('pulse');
    setTimeout(() => {
        document.querySelector('.dashboard').classList.remove('pulse');
    }, 300);

    // 更新仪表盘
    updateDashboard();

    // 检查游戏结束条件
    if (checkGameOver()) {
        setTimeout(() => showSettlement(), 1000);
        return;
    }

    // 下一关
    gameState.level++;
    if (gameState.level > 7) {
        setTimeout(() => showSettlement(), 1000);
    } else {
        setTimeout(() => loadLevel(), 1000);
    }
}

// 更新仪表盘
function updateDashboard() {
    // 现金
    document.getElementById('cashValue').textContent = `${gameState.cash.toFixed(1)}万`;
    const cashPercent = Math.max(0, Math.min(100, (gameState.cash / gameState.initialCash) * 70));
    document.getElementById('cashBar').style.width = `${cashPercent}%`;

    // 压力
    document.getElementById('stressValue').textContent = `${Math.round(gameState.stress)}/100`;
    document.getElementById('stressBar').style.width = `${gameState.stress}%`;

    // 尊严
    document.getElementById('dignityValue').textContent = `${Math.round(gameState.dignity)}/100`;
    document.getElementById('dignityBar').style.width = `${gameState.dignity}%`;

    // 身份
    document.getElementById('identityValue').textContent = `${Math.round(gameState.identity)}/100`;
    document.getElementById('identityBar').style.width = `${gameState.identity}%`;
}

// 检查游戏结束
function checkGameOver() {
    if (gameState.cash <= 0) return true;
    if (gameState.stress >= 100) return true;
    if (gameState.dignity <= 0) return true;
    if (gameState.identity <= 0) return true;
    return false;
}

// 显示结算
function showSettlement() {
    showScreen('settlementScreen');

    var level = gameState.level - 1;
    var percentage = Math.round((level / 7) * 100);

    // 显示结果
    document.getElementById('resultTitle').textContent = '你撑了' + level + '关';
    document.getElementById('resultSubtitle').textContent = '超越了' + percentage + '%的玩家';

    // 显示称号
    var shameTag = getShameTag(level, gameState);
    document.getElementById('shameTag').textContent = shameTag;

    // 显示统计
    document.getElementById('finalCash').textContent = gameState.cash.toFixed(1) + '万';
    document.getElementById('maxStress').textContent = Math.round(gameState.maxStress);

    // 生成并显示分享预览
    var shareText = generateShareText();
    document.getElementById('sharePreview').textContent = shareText;

    // 显示耻辱时刻
    var momentsList = document.getElementById('momentsList');
    momentsList.innerHTML = '';

    var topMoments = gameState.moments.slice(0, 3);
    topMoments.forEach(function(moment) {
        var card = document.createElement('div');
        card.className = 'moment-card';
        card.innerHTML = '<div class="moment-header"><span class="moment-title">第' + moment.level + '关: ' + moment.title + '</span><span class="moment-badge">' + moment.impact + '</span></div><p class="moment-desc">选择了' + moment.choice + '</p>';
        momentsList.appendChild(card);
    });
}

// 生成分享文本
function generateShareText() {
    var level = gameState.level - 1;
    var percentage = Math.round((level / 7) * 100);
    var shameTag = getShameTag(level, gameState);

    var text = '【我还能撑多久？】\n\n';
    text += '🎮 我撑了 ' + level + ' 关！\n';
    text += '📊 超越了 ' + percentage + '% 的玩家\n';
    text += '🏷️ 获得称号：' + shameTag + '\n\n';
    text += '💰 最终现金：' + gameState.cash.toFixed(1) + '万\n';
    text += '💣 最高压力：' + Math.round(gameState.maxStress) + '\n';
    text += '👑 尊严值：' + Math.round(gameState.dignity) + '\n';
    text += '🪞 身份值：' + Math.round(gameState.identity) + '\n\n';

    if (gameState.moments.length > 0) {
        text += '😱 最大耻辱：' + gameState.moments[0].title + '\n\n';
    }

    text += '你能做得更好吗？来挑战吧！';
    return text;
}

// 分享结果
function shareResult() {
    var text = generateShareText();

    // 优先使用Web Share API（移动端）
    if (navigator.share) {
        navigator.share({
            title: '我还能撑多久？',
            text: text,
            url: window.location.href
        }).then(function() {
            console.log('分享成功');
        }).catch(function(err) {
            console.log('分享取消或失败', err);
            // 如果分享失败，尝试复制到剪贴板
            copyToClipboard(text);
        });
    } else {
        // 桌面端使用剪贴板
        copyToClipboard(text);
    }
}

// 获取耻辱标签
function getShameTag(level, state) {
    // 根据关卡数和状态生成标签
    if (level >= 7) {
        return '🏆 生存大师';
    } else if (level >= 5) {
        return '💪 顽强求生者';
    } else if (level >= 3) {
        return '😅 勉强撑住';
    } else if (level >= 1) {
        return '😭 速死玩家';
    } else {
        return '💀 秒杀选手';
    }

    // 根据失败原因添加额外标签
    if (state.cash <= 0) {
        return '💸 破产专家';
    } else if (state.stress >= 100) {
        return '💣 压力爆表';
    } else if (state.dignity <= 0) {
        return '🎭 尊严扫地';
    } else if (state.identity <= 0) {
        return '👻 社会性死亡';
    }
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            alert('✅ 战绩已复制到剪贴板！\n\n' + text + '\n\n您可以粘贴到微信、QQ等社交平台分享给朋友！');
        }).catch(function(err) {
            console.error('复制失败', err);
            // 降级方案：使用传统方法
            fallbackCopy(text);
        });
    } else {
        // 降级方案
        fallbackCopy(text);
    }
}

// 降级复制方案
function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('✅ 战绩已复制到剪贴板！\n\n' + text + '\n\n您可以粘贴到微信、QQ等社交平台分享给朋友！');
    } catch (err) {
        alert('❌ 复制失败，请手动复制以下内容：\n\n' + text);
    }
    document.body.removeChild(textarea);
}

// 重新开始
function restartGame() {
    showScreen('startScreen');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('游戏已加载');
});
