import { joinZaikoFamily, getZaikoUser } from '../../_lib/actions';
import { redirect } from 'next/navigation';

export default async function InvitePage({ params }: { params: { code: string } }) {
  const user = await getZaikoUser();
  const { code } = await params;

  if (!user) {
    // ログインしていない場合はログイン画面へリダイレクト
    // ログイン後に元のURLに戻るように next パラメータを設定
    redirect(`/auth/login?next=/zaiko/invite/${code}`);
  }

  // 家族に参加
  try {
    await joinZaikoFamily(code);
  } catch (e) {
    // エラー (無効なコードなど) の場合はとりあえず設定画面やトップへ
    // TODO: エラー表示
    console.error(e);
  }

  // 完了したらトップへ
  redirect('/zaiko');
}

