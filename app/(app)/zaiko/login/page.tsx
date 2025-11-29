'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { ZaikoShell } from '../_components/layout/zaiko-shell';
import { Mail, Chrome } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { slideInUp, staggerContainer, staggerItem } from '../_lib/motion-presets';
import { useRouter } from 'next/navigation';

export default function ZaikoLoginPage() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    // TODO: Phase 3でSupabase OAuth実装
    console.log('Google login clicked');
  };

  const handleGithubLogin = () => {
    // TODO: Phase 3でSupabase OAuth実装
    console.log('GitHub login clicked');
  };

  const handleEmailLogin = () => {
    // TODO: Phase 3でSupabase Email Auth実装
    console.log('Email login clicked');
  };

  return (
    <>
      <ZaikoHeader
        title="ログイン"
        showBack
        onBack={() => router.push('/zaiko')}
      />
      <ZaikoShell className="flex items-center justify-center">
        <motion.div
          variants={slideInUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-3 text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#32D17D]/10 text-4xl">
                📦
              </div>
              <CardTitle className="text-2xl font-bold">
                Zaikoへようこそ
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                家族みんなで在庫を共有しましょう
              </CardDescription>
            </CardHeader>

            <CardContent>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {/* Google Login */}
                <motion.div variants={staggerItem}>
                  <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    size="lg"
                    className="w-full gap-3 border-2 text-base font-semibold hover:bg-muted hover:scale-[1.02] transition-all"
                  >
                    <Chrome className="h-5 w-5" />
                    Googleでログイン
                  </Button>
                </motion.div>

                {/* GitHub Login */}
                <motion.div variants={staggerItem}>
                  <Button
                    onClick={handleGithubLogin}
                    variant="outline"
                    size="lg"
                    className="w-full gap-3 border-2 text-base font-semibold hover:bg-muted hover:scale-[1.02] transition-all"
                  >
                    <FaGithub className="h-5 w-5" />
                    GitHubでログイン
                  </Button>
                </motion.div>

                {/* Divider */}
                <motion.div
                  variants={staggerItem}
                  className="relative py-4"
                >
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      または
                    </span>
                  </div>
                </motion.div>

                {/* Email Login */}
                <motion.div variants={staggerItem}>
                  <Button
                    onClick={handleEmailLogin}
                    variant="outline"
                    size="lg"
                    className="w-full gap-3 border-2 text-base font-semibold hover:bg-muted hover:scale-[1.02] transition-all"
                  >
                    <Mail className="h-5 w-5" />
                    メールアドレスでログイン
                  </Button>
                </motion.div>

                {/* Notice */}
                <motion.p
                  variants={staggerItem}
                  className="pt-4 text-center text-sm leading-relaxed text-muted-foreground"
                >
                  ログインすることで、
                  <br />
                  利用規約とプライバシーポリシーに同意したものとみなされます
                </motion.p>
              </motion.div>
            </CardContent>
          </Card>

          {/* Demo Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-xl bg-muted/50 p-4 text-center"
          >
            <p className="text-sm font-medium text-muted-foreground">
              💡 現在はUI実装フェーズです
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              認証機能はPhase 3で実装予定です
            </p>
          </motion.div>
        </motion.div>
      </ZaikoShell>
    </>
  );
}

