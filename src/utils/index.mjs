export const formatTeamName = (_teamName) => {
    let teamName = _teamName
    const city = [
        '夏洛特',
        '奥兰多',
        '费城',
        '密尔沃基',
        '波士顿',
        '新奥尔良',
        '波特兰',
        '明尼苏达',
        '圣安东尼奥',
        '丹佛',
        '金州',
        '洛杉矶',
        '达拉斯',
        '布鲁克林',
        '纽约',
        '华盛顿',
        '俄克拉荷马城',
        '犹他',
        '菲尼克斯',
        '亚特兰大',
        '底特律',
        '克利夫兰',
        '印第安纳',
        '休斯顿',
        '多伦多',
        '迈阿密',
        '芝加哥',
        '萨克拉门托',
        '孟菲斯'
    ]

    city.forEach(item => {
        let reg = new RegExp(`${item}`, 'g')
        teamName = teamName.replace(reg, '')
    })
    return teamName
}