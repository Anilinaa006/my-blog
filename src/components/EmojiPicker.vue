<template>
  <div :class="pickerClass" @click.stop>
    <div class="emoji-header">
      <span class="emoji-title">表情</span>
      <el-button class="close-btn" @click="$emit('close')">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    <div class="emoji-content">
      <div
        v-for="(emoji, index) in emojis"
        :key="index"
        class="emoji-item"
        @click="handleEmojiClick(emoji)"
        :title="emoji.name"
      >
        {{ emoji.char }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Close } from "@element-plus/icons-vue";

interface Emoji {
  char: string;
  name: string;
}

const props = defineProps<{
  position?: "above" | "below";
}>();

const pickerClass = computed(() => ({
  "emoji-picker": true,
  above: props.position === "above",
  below: props.position === "below" || !props.position,
}));

const emojis: Emoji[] = [
  { char: "😀", name: "笑脸" },
  { char: "😄", name: "大笑" },
  { char: "😁", name: "露齿笑" },
  { char: "😆", name: "眯眼笑" },
  { char: "😅", name: "苦笑" },
  { char: "🤣", name: "笑哭" },
  { char: "😂", name: "笑哭" },
  { char: "🙂", name: "微笑" },
  { char: "😊", name: "害羞" },
  { char: "😇", name: "天使" },
  { char: "🥰", name: "爱心眼" },
  { char: "😍", name: "花痴" },
  { char: "🤩", name: "星星眼" },
  { char: "😘", name: "飞吻" },
  { char: "😗", name: "亲亲" },
  { char: "😚", name: "害羞亲亲" },
  { char: "😋", name: "馋嘴" },
  { char: "😛", name: "吐舌" },
  { char: "😜", name: "眨眼吐舌" },
  { char: "🤪", name: "搞怪" },
  { char: "😝", name: "眯眼吐舌" },
  { char: "🤑", name: "发财" },
  { char: "🤗", name: "拥抱" },
  { char: "🤭", name: "捂嘴笑" },
  { char: "🤫", name: "嘘" },
  { char: "🤔", name: "思考" },
  { char: "😐", name: "面无表情" },
  { char: "😑", name: "无语" },
  { char: "😶", name: "沉默" },
  { char: "😏", name: "得意" },
  { char: "😒", name: "不爽" },
  { char: "🙄", name: "翻白眼" },
  { char: "😬", name: "尴尬" },
  { char: "😮‍💨", name: "叹气" },
  { char: "🤥", name: "说谎" },
  { char: "😌", name: "释然" },
  { char: "😔", name: "沮丧" },
  { char: "😪", name: "困倦" },
  { char: "🤤", name: "流口水" },
  { char: "😴", name: "睡觉" },
  { char: "😷", name: "口罩" },
  { char: "🤒", name: "发烧" },
  { char: "🤕", name: "受伤" },
  { char: "🤢", name: "恶心" },
  { char: "🤮", name: "呕吐" },
  { char: "🥵", name: "热" },
  { char: "🥶", name: "冷" },
  { char: "🥴", name: "醉了" },
  { char: "😵", name: "晕" },
  { char: "🤯", name: "爆炸头" },
  { char: "🤠", name: "牛仔" },
  { char: "🥳", name: "庆祝" },
  { char: "🥸", name: "伪装" },
  { char: "😎", name: "墨镜" },
  { char: "🤓", name: "书呆子" },
  { char: "🧐", name: "单片眼镜" },
  { char: "😕", name: "困惑" },
  { char: "😟", name: "担心" },
  { char: "🙁", name: "不开心" },
  { char: "☹️", name: "难过" },
  { char: "😮", name: "惊讶" },
  { char: "😯", name: "沉默惊讶" },
  { char: "😲", name: "震惊" },
  { char: "😳", name: "脸红" },
  { char: "🥺", name: "恳求" },
  { char: "😦", name: "皱眉" },
  { char: "😧", name: "苦恼" },
  { char: "😨", name: "害怕" },
  { char: "😰", name: "焦虑" },
  { char: "😥", name: "失望" },
  { char: "😢", name: "哭泣" },
  { char: "😭", name: "大哭" },
  { char: "😱", name: "尖叫" },
  { char: "😖", name: "困扰" },
  { char: "😣", name: "坚持" },
  { char: "😞", name: "失望" },
  { char: "😓", name: "冷汗" },
  { char: "😩", name: "疲惫" },
  { char: "😫", name: "累" },
  { char: "🥱", name: "打哈欠" },
  { char: "😤", name: "生气" },
  { char: "😡", name: "愤怒" },
  { char: "😠", name: "不满" },
  { char: "🤬", name: "骂人" },
  { char: "😈", name: "小恶魔" },
  { char: "👿", name: "恶魔" },
  { char: "💀", name: "骷髅" },
  { char: "☠️", name: "骷髅头" },
  { char: "💩", name: "便便" },
  { char: "🤡", name: "小丑" },
  { char: "👹", name: "妖怪" },
  { char: "👺", name: "天狗" },
  { char: "👻", name: "幽灵" },
  { char: "👽", name: "外星人" },
  { char: "👾", name: "怪物" },
  { char: "🤖", name: "机器人" },
  { char: "🎃", name: "南瓜灯" },
  { char: "😺", name: "笑脸猫" },
  { char: "😸", name: "露齿笑猫" },
  { char: "😹", name: "笑哭猫" },
  { char: "😻", name: "爱心眼猫" },
  { char: "😼", name: "得意猫" },
  { char: "😽", name: "亲亲猫" },
  { char: "🙀", name: "尖叫猫" },
  { char: "😿", name: "哭泣猫" },
  { char: "😾", name: "生气猫" },
  { char: "💋", name: "红唇" },
  { char: "💌", name: "情书" },
  { char: "💘", name: "丘比特" },
  { char: "💝", name: "礼物心" },
  { char: "💖", name: "闪亮心" },
  { char: "💗", name: "成长心" },
  { char: "💓", name: "跳动心" },
  { char: "💞", name: "旋转心" },
  { char: "💕", name: "两颗心" },
  { char: "💟", name: "心形装饰" },
  { char: "❣️", name: "感叹心" },
  { char: "💔", name: "心碎" },
  { char: "❤️", name: "红心" },
  { char: "🧡", name: "橙心" },
  { char: "💛", name: "黄心" },
  { char: "💚", name: "绿心" },
  { char: "💙", name: "蓝心" },
  { char: "💜", name: "紫心" },
  { char: "🖤", name: "黑心" },
  { char: "🤍", name: "白心" },
  { char: "🤎", name: "棕心" },
  { char: "💯", name: "满分" },
  { char: "💢", name: "愤怒" },
  { char: "💥", name: "爆炸" },
  { char: "💫", name: "眩晕" },
  { char: "✨", name: "星星" },
  { char: "🌟", name: "闪亮星" },
  { char: "⭐", name: "黄色星" },
  { char: "⚡", name: "闪电" },
  { char: "🔥", name: "火焰" },
  { char: "💧", name: "水滴" },
  { char: "💦", name: "汗水" },
  { char: "💨", name: "风" },
  { char: "🌈", name: "彩虹" },
  { char: "🌙", name: "月亮" },
  { char: "☀️", name: "太阳" },
  { char: "⭐", name: "星星" },
  { char: "✨", name: "闪烁" },
  { char: "🎉", name: "庆祝" },
  { char: "🎊", name: "彩带" },
  { char: "🎁", name: "礼物" },
  { char: "🎈", name: "气球" },
  { char: "🍎", name: "苹果" },
  { char: "🍊", name: "橙子" },
  { char: "🍋", name: "柠檬" },
  { char: "🍌", name: "香蕉" },
  { char: "🍉", name: "西瓜" },
  { char: "🍇", name: "葡萄" },
  { char: "🍓", name: "草莓" },
  { char: "🍑", name: "桃子" },
  { char: "🍒", name: "樱桃" },
  { char: "🍍", name: "菠萝" },
  { char: "🥝", name: "猕猴桃" },
  { char: "🍅", name: "番茄" },
  { char: "🥑", name: "牛油果" },
  { char: "🌽", name: "玉米" },
  { char: "🥕", name: "胡萝卜" },
  { char: "🥦", name: "西兰花" },
  { char: "🍔", name: "汉堡" },
  { char: "🍟", name: "薯条" },
  { char: "🍕", name: "披萨" },
  { char: "🌭", name: "热狗" },
  { char: "🥪", name: "三明治" },
  { char: "🌮", name: "塔可" },
  { char: "🌯", name: "卷饼" },
  { char: "🍱", name: "便当" },
  { char: "🍣", name: "寿司" },
  { char: "🍤", name: "虾" },
  { char: "🍥", name: "鱼板" },
  { char: "🍢", name: "关东煮" },
  { char: "🍡", name: "团子" },
  { char: "🍧", name: "刨冰" },
  { char: "🍨", name: "冰淇淋" },
  { char: "🍩", name: "甜甜圈" },
  { char: "🍪", name: "饼干" },
  { char: "🎂", name: "蛋糕" },
  { char: "🍰", name: "切蛋糕" },
  { char: "🍫", name: "巧克力" },
  { char: "🍬", name: "糖果" },
  { char: "🍭", name: "棒棒糖" },
  { char: "🍮", name: "布丁" },
  { char: "🍯", name: "蜂蜜" },
  { char: "☕", name: "咖啡" },
  { char: "🍵", name: "茶" },
  { char: "🍶", name: "清酒" },
  { char: "🍷", name: "红酒" },
  { char: "🍺", name: "啤酒" },
  { char: "🍻", name: "干杯" },
  { char: "🥂", name: "干杯香槟" },
  { char: "🥤", name: "饮料" },
  { char: "🧋", name: "奶茶" },
  { char: "🧉", name: "玛黛茶" },
  { char: "🧃", name: "果汁" },
  { char: "🧊", name: "冰块" },
  { char: "🥢", name: "筷子" },
  { char: "🍽️", name: "餐具" },
  { char: "🍴", name: "刀叉" },
  { char: "🥄", name: "勺子" },
];

const emit = defineEmits<{
  (e: "select", emoji: string): void;
  (e: "close"): void;
}>();

const handleEmojiClick = (emoji: Emoji) => {
  emit("select", emoji.char);
};
</script>

<style scoped>
.emoji-picker {
  position: absolute;
  left: 0;
  margin-top: 8px;
  width: 360px;
  max-height: 400px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.emoji-picker.above {
  top: auto;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: 8px;
}

.emoji-picker.below {
  top: 100%;
  bottom: auto;
}

.emoji-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
}

.emoji-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.close-btn {
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-content {
  display: flex;
  flex-wrap: wrap;
  padding: 12px;
  overflow-y: auto;
  max-height: 350px;
}

.emoji-item {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: #f5f7fa;
}

.dark .emoji-picker {
  background: #1a1a2e;
  border-color: #3a3a5c;
}

.dark .emoji-header {
  border-bottom-color: #3a3a5c;
}

.dark .emoji-title {
  color: #e4e7ed;
}

.dark .emoji-item:hover {
  background-color: #2d2d44;
}

@media (max-width: 400px) {
  .emoji-picker {
    width: calc(100vw - 32px);
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
