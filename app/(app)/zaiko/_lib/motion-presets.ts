/**
 * Framer Motion アニメーションプリセット
 * スマホアプリのようなナチュラルで心地よいアニメーション
 */

import { Variants, Transition } from 'framer-motion';

/**
 * イージング関数
 */
export const easings = {
  // Apple風のスムーズなイージング
  smooth: [0.33, 1, 0.68, 1] as [number, number, number, number],
  // iOS標準のイージング
  ios: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  // 軽やかなバウンス
  bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
} as const;

/**
 * デフォルトのトランジション
 */
export const defaultTransition: Transition = {
  duration: 0.3,
  ease: easings.smooth,
};

/**
 * フェードイン
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/**
 * 下からスライドアップ
 */
export const slideInUp: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/**
 * 上からスライドダウン
 */
export const slideInDown: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
};

/**
 * 左からスライドイン
 */
export const slideInLeft: Variants = {
  hidden: {
    x: -30,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    },
  },
};

/**
 * 右からスライドイン
 */
export const slideInRight: Variants = {
  hidden: {
    x: 30,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    },
  },
};

/**
 * スケールイン（軽いバウンス付き）
 */
export const scaleIn: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: easings.bounce,
    },
  },
};

/**
 * スタッガー（順番に表示）用のコンテナ
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * スタッガーアイテム
 */
export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
};

/**
 * ボトムシート用（下からスライド + バウンス）
 */
export const bottomSheet: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: easings.ios,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: easings.smooth,
    },
  },
};

/**
 * タップアニメーション（ボタン用）
 */
export const tapAnimation = {
  scale: 0.96,
  transition: { duration: 0.1 },
};

/**
 * ホバーアニメーション
 */
export const hoverAnimation = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

