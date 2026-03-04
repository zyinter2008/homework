/**
 * 内置电子书库 —— 适合6-8岁小学生，全部带拼音
 * 分类：科普、成语寓言、品德故事、生活常识
 */

function getBookLibrary() {
  return [
    // ===== 科普类 =====
    {
      id: 1001, title: '天空为什么是蓝色的', category: '科普', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '探索大自然中光的奥秘', hasPinyin: true,
      content: '你有没有想过，天空为什么是蓝色的呢？\n\n太阳光看起来是白色的，但其实是由七种颜色混在一起的，就像彩虹一样：红、橙、黄、绿、蓝、靛、紫。\n\n当阳光穿过天空时，空气里有很多小小的分子。蓝色的光更容易被弹来弹去，散到天空的各个方向。所以我们看到的天空就是蓝色的啦！\n\n🤔 想一想：\n傍晚时天空为什么变红了？因为蓝光都散掉了，只剩下红光能到达我们的眼睛。这就是日落很美的原因！',
      pinyinContent: '你(nǐ)有(yǒu)没(méi)有(yǒu)想(xiǎng)过(guò)，\n天(tiān)空(kōng)为(wèi)什(shén)么(me)是(shì)蓝(lán)色(sè)的(de)呢(ne)？\n\n太(tài)阳(yáng)光(guāng)看(kàn)起(qǐ)来(lái)是(shì)白(bái)色(sè)的(de)，\n但(dàn)其(qí)实(shí)是(shì)由(yóu)七(qī)种(zhǒng)颜(yán)色(sè)混(hùn)在(zài)一(yī)起(qǐ)的(de)，\n就(jiù)像(xiàng)彩(cǎi)虹(hóng)一(yí)样(yàng)：\n红(hóng)、橙(chéng)、黄(huáng)、绿(lǜ)、蓝(lán)、靛(diàn)、紫(zǐ)。\n\n当(dāng)阳(yáng)光(guāng)穿(chuān)过(guò)天(tiān)空(kōng)时(shí)，\n空(kōng)气(qì)里(lǐ)有(yǒu)很(hěn)多(duō)小(xiǎo)小(xiǎo)的(de)分(fēn)子(zǐ)。\n蓝(lán)色(sè)的(de)光(guāng)更(gèng)容(róng)易(yì)被(bèi)弹(tán)来(lái)弹(tán)去(qù)，\n散(sàn)到(dào)天(tiān)空(kōng)的(de)各(gè)个(gè)方(fāng)向(xiàng)。\n所(suǒ)以(yǐ)我(wǒ)们(men)看(kàn)到(dào)的(de)天(tiān)空(kōng)就(jiù)是(shì)蓝(lán)色(sè)的(de)啦(la)！\n\n🤔 想(xiǎng)一(yì)想(xiǎng)：\n傍(bàng)晚(wǎn)时(shí)天(tiān)空(kōng)为(wèi)什(shén)么(me)变(biàn)红(hóng)了(le)？\n因(yīn)为(wèi)蓝(lán)光(guāng)都(dōu)散(sàn)掉(diào)了(le)，\n只(zhǐ)剩(shèng)下(xià)红(hóng)光(guāng)能(néng)到(dào)达(dá)我(wǒ)们(men)的(de)眼(yǎn)睛(jīng)。\n这(zhè)就(jiù)是(shì)日(rì)落(luò)很(hěn)美(měi)的(de)原(yuán)因(yīn)！'
    },
    {
      id: 1002, title: '彩虹是怎么形成的', category: '科普', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '下雨后天上那座美丽的桥', hasPinyin: true,
      content: '下过雨以后，天上有时会出现彩虹。红、橙、黄、绿、蓝、靛、紫，七种颜色排成一座美丽的桥。\n\n彩虹是怎么来的呢？原来，阳光穿过空中的小水滴时，会被分成七种颜色。就像用三棱镜分光一样！\n\n每一颗小水滴都像一个小三棱镜，千万颗水滴一起，就变成了美丽的彩虹。\n\n🤔 想一想：用水管对着太阳喷水，你也能看到彩虹哦！',
      pinyinContent: '下(xià)过(guò)雨(yǔ)以(yǐ)后(hòu)，\n天(tiān)上(shàng)有(yǒu)时(shí)会(huì)出(chū)现(xiàn)彩(cǎi)虹(hóng)。\n红(hóng)、橙(chéng)、黄(huáng)、绿(lǜ)、蓝(lán)、靛(diàn)、紫(zǐ)，\n七(qī)种(zhǒng)颜(yán)色(sè)排(pái)成(chéng)一(yī)座(zuò)美(měi)丽(lì)的(de)桥(qiáo)。\n\n彩(cǎi)虹(hóng)是(shì)怎(zěn)么(me)来(lái)的(de)呢(ne)？\n原(yuán)来(lái)，阳(yáng)光(guāng)穿(chuān)过(guò)空(kōng)中(zhōng)的(de)小(xiǎo)水(shuǐ)滴(dī)时(shí)，\n会(huì)被(bèi)分(fēn)成(chéng)七(qī)种(zhǒng)颜(yán)色(sè)。\n就(jiù)像(xiàng)用(yòng)三(sān)棱(léng)镜(jìng)分(fēn)光(guāng)一(yí)样(yàng)！\n\n每(měi)一(yì)颗(kē)小(xiǎo)水(shuǐ)滴(dī)都(dōu)像(xiàng)一(yī)个(gè)小(xiǎo)三(sān)棱(léng)镜(jìng)，\n千(qiān)万(wàn)颗(kē)水(shuǐ)滴(dī)一(yī)起(qǐ)，\n就(jiù)变(biàn)成(chéng)了(le)美(měi)丽(lì)的(de)彩(cǎi)虹(hóng)。\n\n🤔 想(xiǎng)一(yì)想(xiǎng)：\n用(yòng)水(shuǐ)管(guǎn)对(duì)着(zhe)太(tài)阳(yáng)喷(pēn)水(shuǐ)，\n你(nǐ)也(yě)能(néng)看(kàn)到(dào)彩(cǎi)虹(hóng)哦(ó)！'
    },
    {
      id: 1003, title: '恐龙去哪了', category: '科普', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '穿越时空认识远古巨兽', hasPinyin: true,
      content: '很久很久以前，地球上住着一群巨大的动物——恐龙。有的恐龙很大很大，比房子还高。有的恐龙很小，只有小鸡那么大。有的吃草，有的吃肉。\n\n可是大约六千五百万年前，一颗巨大的陨石撞上了地球！天空被灰尘遮住了，太阳照不进来，天气变得又冷又暗。植物枯死了，恐龙也慢慢消失了。\n\n不过，科学家发现，今天的小鸟就是恐龙的后代呢！',
      pinyinContent: '很(hěn)久(jiǔ)很(hěn)久(jiǔ)以(yǐ)前(qián)，\n地(dì)球(qiú)上(shàng)住(zhù)着(zhe)一(yī)群(qún)巨(jù)大(dà)的(de)动(dòng)物(wù)——恐(kǒng)龙(lóng)。\n\n有(yǒu)的(de)恐(kǒng)龙(lóng)很(hěn)大(dà)很(hěn)大(dà)，\n比(bǐ)房(fáng)子(zi)还(hái)高(gāo)。\n有(yǒu)的(de)恐(kǒng)龙(lóng)很(hěn)小(xiǎo)，\n只(zhǐ)有(yǒu)小(xiǎo)鸡(jī)那(nà)么(me)大(dà)。\n有(yǒu)的(de)吃(chī)草(cǎo)，有(yǒu)的(de)吃(chī)肉(ròu)。\n\n可(kě)是(shì)大(dà)约(yuē)六(liù)千(qiān)五(wǔ)百(bǎi)万(wàn)年(nián)前(qián)，\n一(yī)颗(kē)巨(jù)大(dà)的(de)陨(yǔn)石(shí)撞(zhuàng)上(shàng)了(le)地(dì)球(qiú)！\n天(tiān)空(kōng)被(bèi)灰(huī)尘(chén)遮(zhē)住(zhù)了(le)，\n太(tài)阳(yáng)照(zhào)不(bú)进(jìn)来(lái)，\n天(tiān)气(qì)变(biàn)得(de)又(yòu)冷(lěng)又(yòu)暗(àn)。\n植(zhí)物(wù)枯(kū)死(sǐ)了(le)，\n恐(kǒng)龙(lóng)也(yě)慢(màn)慢(man)消(xiāo)失(shī)了(le)。\n\n不(bú)过(guò)，科(kē)学(xué)家(jiā)发(fā)现(xiàn)，\n今(jīn)天(tiān)的(de)小(xiǎo)鸟(niǎo)就(jiù)是(shì)恐(kǒng)龙(lóng)的(de)后(hòu)代(dài)呢(ne)！'
    },
    {
      id: 1004, title: '种子的旅行', category: '科普', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '植物宝宝怎么去远方安家', hasPinyin: true,
      content: '植物不能走路，那种子怎么去远方呢？它们有很多聪明的办法！\n\n蒲公英的种子像小伞，风一吹就飞到远方。\n\n苍耳的种子身上有小刺，粘在动物的毛上去旅行。\n\n椰子掉进大海里，随着海浪漂到新的海岛上。\n\n豌豆成熟后，豆荚"啪"地裂开，把种子弹到远处。\n\n🌱 大自然真奇妙！每颗种子都有自己的旅行方式。',
      pinyinContent: '植(zhí)物(wù)不(bù)能(néng)走(zǒu)路(lù)，\n那(nà)种(zhǒng)子(zi)怎(zěn)么(me)去(qù)远(yuǎn)方(fāng)呢(ne)？\n它(tā)们(men)有(yǒu)很(hěn)多(duō)聪(cōng)明(míng)的(de)办(bàn)法(fǎ)！\n\n蒲(pú)公(gōng)英(yīng)的(de)种(zhǒng)子(zi)像(xiàng)小(xiǎo)伞(sǎn)，\n风(fēng)一(yī)吹(chuī)就(jiù)飞(fēi)到(dào)远(yuǎn)方(fāng)。\n\n苍(cāng)耳(ěr)的(de)种(zhǒng)子(zi)身(shēn)上(shàng)有(yǒu)小(xiǎo)刺(cì)，\n粘(zhān)在(zài)动(dòng)物(wù)的(de)毛(máo)上(shàng)去(qù)旅(lǚ)行(xíng)。\n\n椰(yē)子(zi)掉(diào)进(jìn)大(dà)海(hǎi)里(lǐ)，\n随(suí)着(zhe)海(hǎi)浪(làng)漂(piāo)到(dào)新(xīn)的(de)海(hǎi)岛(dǎo)上(shàng)。\n\n豌(wān)豆(dòu)成(chéng)熟(shú)后(hòu)，\n豆(dòu)荚(jiá)"啪(pā)"地(de)裂(liè)开(kāi)，\n把(bǎ)种(zhǒng)子(zi)弹(tán)到(dào)远(yuǎn)处(chù)。\n\n🌱 大(dà)自(zì)然(rán)真(zhēn)奇(qí)妙(miào)！\n每(měi)颗(kē)种(zhǒng)子(zi)都(dōu)有(yǒu)自(zì)己(jǐ)的(de)旅(lǚ)行(xíng)方(fāng)式(shì)。'
    },
    {
      id: 1005, title: '月亮为什么会变化', category: '科普', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '探索月亮圆缺的秘密', hasPinyin: true,
      content: '你有没有发现，月亮有时圆圆的，有时弯弯的，像一把镰刀？\n\n其实，月亮自己不会发光。我们看到的月光，是太阳光照在月亮上反射回来的。\n\n月亮绕着地球转，太阳照到月亮的部分不一样，所以我们看到的形状也不同。\n\n从弯月到满月再到弯月，大约需要一个月。所以"月"这个字就是这么来的呢！',
      pinyinContent: '你(nǐ)有(yǒu)没(méi)有(yǒu)发(fā)现(xiàn)，\n月(yuè)亮(liang)有(yǒu)时(shí)圆(yuán)圆(yuán)的(de)，\n有(yǒu)时(shí)弯(wān)弯(wān)的(de)，像(xiàng)一(yī)把(bǎ)镰(lián)刀(dāo)？\n\n其(qí)实(shí)，月(yuè)亮(liang)自(zì)己(jǐ)不(bù)会(huì)发(fā)光(guāng)。\n我(wǒ)们(men)看(kàn)到(dào)的(de)月(yuè)光(guāng)，\n是(shì)太(tài)阳(yáng)光(guāng)照(zhào)在(zài)月(yuè)亮(liang)上(shàng)\n反(fǎn)射(shè)回(huí)来(lái)的(de)。\n\n月(yuè)亮(liang)绕(rào)着(zhe)地(dì)球(qiú)转(zhuàn)，\n太(tài)阳(yáng)照(zhào)到(dào)月(yuè)亮(liang)的(de)部(bù)分(fèn)不(bù)一(yī)样(yàng)，\n所(suǒ)以(yǐ)我(wǒ)们(men)看(kàn)到(dào)的(de)形(xíng)状(zhuàng)也(yě)不(bù)同(tóng)。\n\n从(cóng)弯(wān)月(yuè)到(dào)满(mǎn)月(yuè)再(zài)到(dào)弯(wān)月(yuè)，\n大(dà)约(yuē)需(xū)要(yào)一(yī)个(gè)月(yuè)。\n所(suǒ)以(yǐ)"月(yuè)"这(zhè)个(gè)字(zì)\n就(jiù)是(shì)这(zhè)么(me)来(lái)的(de)呢(ne)！'
    },
    // ===== 成语寓言类 =====
    {
      id: 1006, title: '守株待兔', category: '成语', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '不能只靠运气的道理', hasPinyin: true,
      content: '从前，宋国有一个农夫，每天都在田里辛苦地干活。\n\n有一天，一只兔子飞快地跑过田地，一头撞在了田边的大树桩上，当场就死了。\n\n农夫捡到了这只兔子，高兴极了："不用干活就能白白得到一只兔子，太好了！"\n\n从那以后，农夫再也不种地了。他每天都坐在树桩旁边，等着下一只兔子自己撞上来。\n\n可是，再也没有兔子撞过来。他的田地长满了杂草，庄稼全都枯死了。\n\n💡 道理："守株待兔"告诉我们，不能只靠运气。想要有好的收获，就要脚踏实地地努力！',
      pinyinContent: '从(cóng)前(qián)，宋(sòng)国(guó)有(yǒu)一(yí)个(gè)农(nóng)夫(fū)，\n每(měi)天(tiān)都(dōu)在(zài)田(tián)里(lǐ)辛(xīn)苦(kǔ)地(de)干(gàn)活(huó)。\n\n有(yǒu)一(yī)天(tiān)，一(yī)只(zhī)兔(tù)子(zi)飞(fēi)快(kuài)地(de)跑(pǎo)过(guò)田(tián)地(dì)，\n一(yī)头(tóu)撞(zhuàng)在(zài)了(le)田(tián)边(biān)的(de)大(dà)树(shù)桩(zhuāng)上(shàng)，\n当(dāng)场(chǎng)就(jiù)死(sǐ)了(le)。\n\n农(nóng)夫(fū)捡(jiǎn)到(dào)了(le)这(zhè)只(zhī)兔(tù)子(zi)，\n高(gāo)兴(xìng)极(jí)了(le)：\n"不(bù)用(yòng)干(gàn)活(huó)就(jiù)能(néng)得(dé)到(dào)兔(tù)子(zi)，太(tài)好(hǎo)了(le)！"\n\n从(cóng)那(nà)以(yǐ)后(hòu)，\n农(nóng)夫(fū)再(zài)也(yě)不(bù)种(zhòng)地(dì)了(le)。\n他(tā)每(měi)天(tiān)都(dōu)坐(zuò)在(zài)树(shù)桩(zhuāng)旁(páng)边(biān)，\n等(děng)着(zhe)下(xià)一(yī)只(zhī)兔(tù)子(zi)自(zì)己(jǐ)撞(zhuàng)上(shàng)来(lái)。\n\n可(kě)是(shì)，再(zài)也(yě)没(méi)有(yǒu)兔(tù)子(zi)撞(zhuàng)过(guò)来(lái)。\n他(tā)的(de)田(tián)地(dì)长(zhǎng)满(mǎn)了(le)杂(zá)草(cǎo)，\n庄(zhuāng)稼(jia)全(quán)都(dōu)枯(kū)死(sǐ)了(le)。\n\n💡 道(dào)理(lǐ)：\n"守(shǒu)株(zhū)待(dài)兔(tù)"告(gào)诉(sù)我(wǒ)们(men)，\n不(bù)能(néng)只(zhǐ)靠(kào)运(yùn)气(qì)。\n想(xiǎng)要(yào)有(yǒu)好(hǎo)的(de)收(shōu)获(huò)，\n就(jiù)要(yào)脚(jiǎo)踏(tà)实(shí)地(dì)努(nǔ)力(lì)！'
    },
    {
      id: 1007, title: '龟兔赛跑', category: '寓言', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '坚持到底就是胜利', hasPinyin: true,
      content: '兔子跑得快，乌龟爬得慢。有一天，兔子笑话乌龟："你爬得那么慢，敢和我比赛跑吗？"乌龟说："好，比就比！"\n\n比赛开始了，兔子飞快地跑在前面。它回头一看，乌龟还在后面慢慢爬。兔子心想："乌龟太慢了，我先睡一觉吧。"\n\n兔子在大树下睡着了。乌龟一步一步，不停地往前爬。等兔子醒来，乌龟已经到了终点！\n\n💡 道理：坚持不放弃，就能到达终点。骄傲大意，反而会失败。',
      pinyinContent: '兔(tù)子(zi)跑(pǎo)得(de)快(kuài)，乌(wū)龟(guī)爬(pá)得(de)慢(màn)。\n有(yǒu)一(yī)天(tiān)，兔(tù)子(zi)笑(xiào)话(hua)乌(wū)龟(guī)：\n"你(nǐ)爬(pá)得(de)那(nà)么(me)慢(màn)，\n敢(gǎn)和(hé)我(wǒ)比(bǐ)赛(sài)跑(pǎo)吗(ma)？"\n乌(wū)龟(guī)说(shuō)："好(hǎo)，比(bǐ)就(jiù)比(bǐ)！"\n\n比(bǐ)赛(sài)开(kāi)始(shǐ)了(le)，\n兔(tù)子(zi)飞(fēi)快(kuài)地(de)跑(pǎo)在(zài)前(qián)面(miàn)。\n它(tā)回(huí)头(tóu)一(yī)看(kàn)，\n乌(wū)龟(guī)还(hái)在(zài)后(hòu)面(miàn)慢(màn)慢(man)爬(pá)。\n兔(tù)子(zi)心(xīn)想(xiǎng)：\n"乌(wū)龟(guī)太(tài)慢(màn)了(le)，我(wǒ)先(xiān)睡(shuì)一(yí)觉(jiào)吧(ba)。"\n\n兔(tù)子(zi)在(zài)大(dà)树(shù)下(xià)睡(shuì)着(zháo)了(le)。\n乌(wū)龟(guī)一(yī)步(bù)一(yī)步(bù)，不(bù)停(tíng)地(de)往(wǎng)前(qián)爬(pá)。\n等(děng)兔(tù)子(zi)醒(xǐng)来(lái)，\n乌(wū)龟(guī)已(yǐ)经(jīng)到(dào)了(le)终(zhōng)点(diǎn)！\n\n💡 道(dào)理(lǐ)：\n坚(jiān)持(chí)不(bù)放(fàng)弃(qì)，就(jiù)能(néng)到(dào)达(dá)终(zhōng)点(diǎn)。\n骄(jiāo)傲(ào)大(dà)意(yì)，反(fǎn)而(ér)会(huì)失(shī)败(bài)。'
    },
    {
      id: 1008, title: '狐假虎威', category: '成语', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '真正的本事要靠自己', hasPinyin: true,
      content: '有一天，老虎抓住了一只狐狸。狐狸说："你不能吃我！天帝派我来管森林里的动物。不信？你跟在我后面走，看动物们怕不怕我！"\n\n老虎半信半疑，跟在狐狸后面走。森林里的小动物看见了，全都吓得跑走了！老虎以为它们真的怕狐狸。\n\n其实呢？动物们怕的是狐狸身后的老虎呀！\n\n💡 道理："狐假虎威"就是借别人的力量吓唬人。真正的本事要靠自己！',
      pinyinContent: '有(yǒu)一(yī)天(tiān)，\n老(lǎo)虎(hǔ)抓(zhuā)住(zhù)了(le)一(yī)只(zhī)狐(hú)狸(li)。\n狐(hú)狸(li)说(shuō)：\n"你(nǐ)不(bù)能(néng)吃(chī)我(wǒ)！\n天(tiān)帝(dì)派(pài)我(wǒ)来(lái)管(guǎn)森(sēn)林(lín)里(lǐ)的(de)动(dòng)物(wù)。\n不(bù)信(xìn)？你(nǐ)跟(gēn)在(zài)我(wǒ)后(hòu)面(miàn)走(zǒu)，\n看(kàn)动(dòng)物(wù)们(men)怕(pà)不(bú)怕(pà)我(wǒ)！"\n\n老(lǎo)虎(hǔ)半(bàn)信(xìn)半(bàn)疑(yí)，\n跟(gēn)在(zài)狐(hú)狸(li)后(hòu)面(miàn)走(zǒu)。\n森(sēn)林(lín)里(lǐ)的(de)小(xiǎo)动(dòng)物(wù)看(kàn)见(jiàn)了(le)，\n全(quán)都(dōu)吓(xià)得(de)跑(pǎo)走(zǒu)了(le)！\n老(lǎo)虎(hǔ)以(yǐ)为(wéi)它(tā)们(men)真(zhēn)的(de)怕(pà)狐(hú)狸(li)。\n\n其(qí)实(shí)呢(ne)？\n动(dòng)物(wù)们(men)怕(pà)的(de)是(shì)\n狐(hú)狸(li)身(shēn)后(hòu)的(de)老(lǎo)虎(hǔ)呀(ya)！\n\n💡 道(dào)理(lǐ)：\n"狐(hú)假(jiǎ)虎(hǔ)威(wēi)"就(jiù)是(shì)\n借(jiè)别(bié)人(rén)的(de)力(lì)量(liàng)吓(xià)唬(hu)人(rén)。\n真(zhēn)正(zhèng)的(de)本(běn)事(shì)要(yào)靠(kào)自(zì)己(jǐ)！'
    },
    {
      id: 1009, title: '铁杵磨针', category: '成语', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '只要功夫深，铁杵磨成针', hasPinyin: true,
      content: '李白是唐朝最有名的大诗人。小时候，他读书不用心，常常逃学出去玩。\n\n有一天，李白又逃学了。他走到小河边，看见一位老奶奶坐在石头上，拿着一根很粗的铁棒在磨。\n\n李白好奇地问："老奶奶，您磨铁棒做什么呀？"\n\n老奶奶说："我要把它磨成一根绣花针。"\n\n李白惊讶地说："这么粗的铁棒，要磨到什么时候呀？"\n\n老奶奶笑着说："只要每天磨一点，总有一天能磨成针。"\n\n李白听了很惭愧。从此以后，他发奋读书，终于成了大诗人。\n\n💡 道理：只要坚持不懈，再难的事情也能做成！',
      pinyinContent: '李(lǐ)白(bái)是(shì)唐(táng)朝(cháo)最(zuì)有(yǒu)名(míng)的(de)大(dà)诗(shī)人(rén)。\n小(xiǎo)时(shí)候(hòu)，他(tā)读(dú)书(shū)不(bù)用(yòng)心(xīn)，\n常(cháng)常(cháng)逃(táo)学(xué)出(chū)去(qù)玩(wán)。\n\n有(yǒu)一(yī)天(tiān)，李(lǐ)白(bái)又(yòu)逃(táo)学(xué)了(le)。\n他(tā)走(zǒu)到(dào)小(xiǎo)河(hé)边(biān)，\n看(kàn)见(jiàn)一(yī)位(wèi)老(lǎo)奶(nǎi)奶(nai)坐(zuò)在(zài)石(shí)头(tou)上(shàng)，\n拿(ná)着(zhe)一(yī)根(gēn)很(hěn)粗(cū)的(de)铁(tiě)棒(bàng)在(zài)磨(mó)。\n\n李(lǐ)白(bái)好(hào)奇(qí)地(de)问(wèn)：\n"老(lǎo)奶(nǎi)奶(nai)，您(nín)磨(mó)铁(tiě)棒(bàng)做(zuò)什(shén)么(me)呀(ya)？"\n\n老(lǎo)奶(nǎi)奶(nai)说(shuō)：\n"我(wǒ)要(yào)把(bǎ)它(tā)磨(mó)成(chéng)一(yī)根(gēn)绣(xiù)花(huā)针(zhēn)。"\n\n李(lǐ)白(bái)惊(jīng)讶(yà)地(de)说(shuō)：\n"这(zhè)么(me)粗(cū)的(de)铁(tiě)棒(bàng)，\n要(yào)磨(mó)到(dào)什(shén)么(me)时(shí)候(hòu)呀(ya)？"\n\n老(lǎo)奶(nǎi)奶(nai)笑(xiào)着(zhe)说(shuō)：\n"只(zhǐ)要(yào)每(měi)天(tiān)磨(mó)一(yī)点(diǎn)，\n总(zǒng)有(yǒu)一(yī)天(tiān)能(néng)磨(mó)成(chéng)针(zhēn)。"\n\n李(lǐ)白(bái)听(tīng)了(le)很(hěn)惭(cán)愧(kuì)。\n从(cóng)此(cǐ)以(yǐ)后(hòu)，他(tā)发(fā)奋(fèn)读(dú)书(shū)，\n终(zhōng)于(yú)成(chéng)了(le)大(dà)诗(shī)人(rén)。\n\n💡 道(dào)理(lǐ)：\n只(zhǐ)要(yào)坚(jiān)持(chí)不(bú)懈(xiè)，\n再(zài)难(nán)的(de)事(shì)情(qíng)也(yě)能(néng)做(zuò)成(chéng)！'
    },
    // ===== 品德故事类 =====
    {
      id: 1010, title: '司马光砸缸', category: '品德', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '遇到危险要冷静想办法', hasPinyin: true,
      content: '古时候，有个孩子叫司马光。有一天，他和小伙伴们在花园里玩。\n\n花园里有一口大水缸，装满了水。一个小朋友爬到缸边玩，一不小心掉进了水缸里！\n\n其他孩子都吓哭了，有的跑去找大人。只有司马光没有慌。\n\n他搬起一块大石头，使劲砸向水缸。"砰！"缸破了，水流了出来，小朋友得救了！\n\n💡 道理：遇到危险不要慌，冷静想办法才能解决问题！',
      pinyinContent: '古(gǔ)时(shí)候(hòu)，有(yǒu)个(gè)孩(hái)子(zi)叫(jiào)司(sī)马(mǎ)光(guāng)。\n有(yǒu)一(yī)天(tiān)，\n他(tā)和(hé)小(xiǎo)伙(huǒ)伴(bàn)们(men)在(zài)花(huā)园(yuán)里(lǐ)玩(wán)。\n\n花(huā)园(yuán)里(lǐ)有(yǒu)一(yī)口(kǒu)大(dà)水(shuǐ)缸(gāng)，\n装(zhuāng)满(mǎn)了(le)水(shuǐ)。\n一(yī)个(gè)小(xiǎo)朋(péng)友(yǒu)爬(pá)到(dào)缸(gāng)边(biān)玩(wán)，\n一(yī)不(bù)小(xiǎo)心(xīn)掉(diào)进(jìn)了(le)水(shuǐ)缸(gāng)里(lǐ)！\n\n其(qí)他(tā)孩(hái)子(zi)都(dōu)吓(xià)哭(kū)了(le)，\n有(yǒu)的(de)跑(pǎo)去(qù)找(zhǎo)大(dà)人(rén)。\n只(zhǐ)有(yǒu)司(sī)马(mǎ)光(guāng)没(méi)有(yǒu)慌(huāng)。\n\n他(tā)搬(bān)起(qǐ)一(yī)块(kuài)大(dà)石(shí)头(tou)，\n使(shǐ)劲(jìn)砸(zá)向(xiàng)水(shuǐ)缸(gāng)。\n"砰(pēng)！"缸(gāng)破(pò)了(le)，\n水(shuǐ)流(liú)了(le)出(chū)来(lái)，\n小(xiǎo)朋(péng)友(yǒu)得(dé)救(jiù)了(le)！\n\n💡 道(dào)理(lǐ)：\n遇(yù)到(dào)危(wēi)险(xiǎn)不(bù)要(yào)慌(huāng)，\n冷(lěng)静(jìng)想(xiǎng)办(bàn)法(fǎ)才(cái)能(néng)解(jiě)决(jué)问(wèn)题(tí)！'
    },
    {
      id: 1011, title: '孔融让梨', category: '品德', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '学会谦让是一种美德', hasPinyin: true,
      content: '东汉时候，有个孩子叫孔融。他四岁的时候，爸爸买了一些梨让孩子们吃。\n\n哥哥让孔融先拿。孔融拿了一个最小的梨。\n\n爸爸问："为什么拿小的？"\n\n孔融说："我年纪小，应该吃小的。大的留给哥哥们吃。"\n\n爸爸又问："弟弟比你小呀？"\n\n孔融说："我是哥哥，应该让着弟弟。"\n\n💡 道理：学会谦让，先想到别人，是一种美德。',
      pinyinContent: '东(dōng)汉(hàn)时(shí)候(hòu)，\n有(yǒu)个(gè)孩(hái)子(zi)叫(jiào)孔(kǒng)融(róng)。\n他(tā)四(sì)岁(suì)的(de)时(shí)候(hòu)，\n爸(bà)爸(ba)买(mǎi)了(le)一(yī)些(xiē)梨(lí)让(ràng)孩(hái)子(zi)们(men)吃(chī)。\n\n哥(gē)哥(ge)让(ràng)孔(kǒng)融(róng)先(xiān)拿(ná)。\n孔(kǒng)融(róng)拿(ná)了(le)一(yī)个(gè)最(zuì)小(xiǎo)的(de)梨(lí)。\n\n爸(bà)爸(ba)问(wèn)："为(wèi)什(shén)么(me)拿(ná)小(xiǎo)的(de)？"\n\n孔(kǒng)融(róng)说(shuō)：\n"我(wǒ)年(nián)纪(jì)小(xiǎo)，应(yīng)该(gāi)吃(chī)小(xiǎo)的(de)。\n大(dà)的(de)留(liú)给(gěi)哥(gē)哥(ge)们(men)吃(chī)。"\n\n爸(bà)爸(ba)又(yòu)问(wèn)："弟(dì)弟(di)比(bǐ)你(nǐ)小(xiǎo)呀(ya)？"\n\n孔(kǒng)融(róng)说(shuō)：\n"我(wǒ)是(shì)哥(gē)哥(ge)，\n应(yīng)该(gāi)让(ràng)着(zhe)弟(dì)弟(di)。"\n\n💡 道(dào)理(lǐ)：\n学(xué)会(huì)谦(qiān)让(ràng)，\n先(xiān)想(xiǎng)到(dào)别(bié)人(rén)，是(shì)一(yī)种(zhǒng)美(měi)德(dé)。'
    },
    // ===== 动物 / 生活类 =====
    {
      id: 1012, title: '勤劳的蜜蜂', category: '科普', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '认识蜜蜂王国的奇妙生活', hasPinyin: true,
      content: '你吃过甜甜的蜂蜜吗？蜂蜜是怎么来的呢？\n\n🐝 蜜蜂王国\n一个蜂巢里住着几万只蜜蜂，它们分工合作：蜂王负责产卵，工蜂负责采蜜和建巢。\n\n🌸 蜜蜂怎么采蜜？\n工蜂飞到花朵上，吸取花蜜存在肚子里。一只蜜蜂要采集大约1500朵花，才能装满一次！回到蜂巢后，蜜蜂们用翅膀扇风让水分蒸发，花蜜就变成了蜂蜜。\n\n🐝 蜜蜂还会跳舞！发现好的花，它会跳"8字舞"告诉同伴方向。\n\n💡 蜜蜂虽然小，但是大家分工合作，就能做成了不起的事情！',
      pinyinContent: '你(nǐ)吃(chī)过(guò)甜(tián)甜(tián)的(de)蜂(fēng)蜜(mì)吗(ma)？\n蜂(fēng)蜜(mì)是(shì)怎(zěn)么(me)来(lái)的(de)呢(ne)？\n\n🐝 蜜(mì)蜂(fēng)王(wáng)国(guó)\n一(yí)个(gè)蜂(fēng)巢(cháo)里(lǐ)住(zhù)着(zhe)几(jǐ)万(wàn)只(zhī)蜜(mì)蜂(fēng)，\n它(tā)们(men)分(fēn)工(gōng)合(hé)作(zuò)：\n蜂(fēng)王(wáng)负(fù)责(zé)产(chǎn)卵(luǎn)，\n工(gōng)蜂(fēng)负(fù)责(zé)采(cǎi)蜜(mì)和(hé)建(jiàn)巢(cháo)。\n\n🌸 蜜(mì)蜂(fēng)怎(zěn)么(me)采(cǎi)蜜(mì)？\n工(gōng)蜂(fēng)飞(fēi)到(dào)花(huā)朵(duǒ)上(shàng)，\n吸(xī)取(qǔ)花(huā)蜜(mì)存(cún)在(zài)肚(dù)子(zi)里(lǐ)。\n一(yī)只(zhī)蜜(mì)蜂(fēng)要(yào)采(cǎi)集(jí)大(dà)约(yuē)1500朵(duǒ)花(huā)，\n才(cái)能(néng)装(zhuāng)满(mǎn)一(yí)次(cì)！\n回(huí)到(dào)蜂(fēng)巢(cháo)后(hòu)，\n蜜(mì)蜂(fēng)们(men)用(yòng)翅(chì)膀(bǎng)扇(shān)风(fēng)\n让(ràng)水(shuǐ)分(fèn)蒸(zhēng)发(fā)，\n花(huā)蜜(mì)就(jiù)变(biàn)成(chéng)了(le)蜂(fēng)蜜(mì)。\n\n🐝 蜜(mì)蜂(fēng)还(hái)会(huì)跳(tiào)舞(wǔ)！\n发(fā)现(xiàn)好(hǎo)的(de)花(huā)，\n它(tā)会(huì)跳(tiào)"8字(zì)舞(wǔ)"告(gào)诉(sù)同(tóng)伴(bàn)方(fāng)向(xiàng)。\n\n💡 蜜(mì)蜂(fēng)虽(suī)然(rán)小(xiǎo)，\n但(dàn)是(shì)大(dà)家(jiā)分(fēn)工(gōng)合(hé)作(zuò)，\n就(jiù)能(néng)做(zuò)成(chéng)了(le)不(bù)起(qǐ)的(de)事(shì)情(qíng)！'
    },
    {
      id: 1013, title: '小蝌蚪找妈妈', category: '科普', type: 'book', duration: '10分钟',
      ageMin: 6, ageMax: 8, desc: '跟着小蝌蚪认识动物的变化', hasPinyin: true,
      content: '春天来了，池塘里有一群小蝌蚪。它们长着大大的脑袋，黑黑的身体，甩着长长的尾巴，快活地游来游去。\n\n它们看见鸭妈妈带着小鸭子游过，就问："我们的妈妈在哪里？"\n\n鸭妈妈说："你们的妈妈有两只大眼睛，白肚皮。"\n\n小蝌蚪游啊游，看见了大金鱼。大金鱼有大眼睛，可是红肚皮。"你不是我们的妈妈！"\n\n它们又看见了大乌龟，大乌龟有四条腿，可是背上有壳。"你也不是我们的妈妈！"\n\n最后，它们看见一只青蛙。大眼睛，白肚皮，四条腿。"妈妈！妈妈！"\n\n原来，小蝌蚪长大了就会变成青蛙！',
      pinyinContent: '春(chūn)天(tiān)来(lái)了(le)，\n池(chí)塘(táng)里(lǐ)有(yǒu)一(yī)群(qún)小(xiǎo)蝌(kē)蚪(dǒu)。\n它(tā)们(men)长(zhǎng)着(zhe)大(dà)大(dà)的(de)脑(nǎo)袋(dai)，\n黑(hēi)黑(hēi)的(de)身(shēn)体(tǐ)，\n甩(shuǎi)着(zhe)长(cháng)长(cháng)的(de)尾(wěi)巴(ba)，\n快(kuài)活(huó)地(de)游(yóu)来(lái)游(yóu)去(qù)。\n\n它(tā)们(men)看(kàn)见(jiàn)鸭(yā)妈(mā)妈(ma)带(dài)着(zhe)小(xiǎo)鸭(yā)子(zi)游(yóu)过(guò)，\n就(jiù)问(wèn)："我(wǒ)们(men)的(de)妈(mā)妈(ma)在(zài)哪(nǎ)里(lǐ)？"\n\n鸭(yā)妈(mā)妈(ma)说(shuō)：\n"你(nǐ)们(men)的(de)妈(mā)妈(ma)有(yǒu)两(liǎng)只(zhī)大(dà)眼(yǎn)睛(jīng)，\n白(bái)肚(dù)皮(pí)。"\n\n小(xiǎo)蝌(kē)蚪(dǒu)游(yóu)啊(a)游(yóu)，\n看(kàn)见(jiàn)了(le)大(dà)金(jīn)鱼(yú)。\n大(dà)金(jīn)鱼(yú)有(yǒu)大(dà)眼(yǎn)睛(jīng)，\n可(kě)是(shì)红(hóng)肚(dù)皮(pí)。\n"你(nǐ)不(bú)是(shì)我(wǒ)们(men)的(de)妈(mā)妈(ma)！"\n\n它(tā)们(men)又(yòu)看(kàn)见(jiàn)了(le)大(dà)乌(wū)龟(guī)，\n大(dà)乌(wū)龟(guī)有(yǒu)四(sì)条(tiáo)腿(tuǐ)，\n可(kě)是(shì)背(bèi)上(shang)有(yǒu)壳(ké)。\n"你(nǐ)也(yě)不(bú)是(shì)我(wǒ)们(men)的(de)妈(mā)妈(ma)！"\n\n最(zuì)后(hòu)，它(tā)们(men)看(kàn)见(jiàn)一(yī)只(zhī)青(qīng)蛙(wā)。\n大(dà)眼(yǎn)睛(jīng)，白(bái)肚(dù)皮(pí)，四(sì)条(tiáo)腿(tuǐ)。\n"妈(mā)妈(ma)！妈(mā)妈(ma)！"\n\n原(yuán)来(lái)，小(xiǎo)蝌(kē)蚪(dǒu)长(zhǎng)大(dà)了(le)\n就(jiù)会(huì)变(biàn)成(chéng)青(qīng)蛙(wā)！'
    }
  ];
}

module.exports = { getBookLibrary };
