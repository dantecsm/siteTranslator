//todo: 改 iciba 模块为 mongodb 数据库查询释义

var request = require('request')

const URL = 'http://www.kekenet.com/broadcast/201901/575513.shtml'
tranSite(URL)

// 工具函数，封装 request 为 promise 版
function prequest(url) {
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        })
    })
}

// 输入一个单词，输出 iciba 查询结果
function iciba(word) {
    return prequest(`http://www.iciba.com/index.php?a=getWordMean&c=search&word=${word}`)
}

// 从 iciba 返回的 body 中找到中文意思
function parseMeaning(body) {
    try {
        var json = JSON.parse(body)
        var means = json.baesInfo.symbols[0].parts[0].means
        return means
    } catch(e) {
        return 'Unknown'
    }
}

// 输入一个单词，输出这个单词的意思
async function translate(word) {
    var body = await iciba(word)
    var means = parseMeaning(body)
    console.log(word, means)
}

// 输入一个网址，找出这个网址所有单词
function extractWords(url) {
    return prequest(url).then(body => {
        var words = body.match(/[a-zA-Z]+/ig)
        words = Array.from(new Set(words))
        return words
    }).catch(e => {
        console.log('网络访问出错了')
    })
}

// 主函数，输入一个网址，输出这个网址所有单词及释义
function tranSite(url) {
    extractWords(url).then(e => e.forEach(translate))
}