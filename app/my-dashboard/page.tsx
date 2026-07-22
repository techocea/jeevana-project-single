import { createClient } from '@/utils/supabase';
import { redirect } from 'next/navigation';
import React from 'react'

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?mode=login");
  }


  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage