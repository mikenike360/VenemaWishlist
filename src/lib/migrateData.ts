// Data Migration Script
// Run this after setting up Supabase to seed initial profile data
// You can run this from the browser console or create a one-time admin page

import { supabase } from './supabase';

export interface InitialUserData {
  name: string;
  wishlistLink: string;
}

const initialUsers: InitialUserData[] = [
  { name: 'Michael', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/YP3U0JTFQA50?ref_=wl_share' },
  { name: 'Amanda', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/2KYDF3TIJBL0M?ref_=wl_share' },
  { name: 'Joey', wishlistLink: 'https://www.amazon.com/registry/wishlist/FW36XQGEIFOD/ref=cm_sw_r_cp_ep_ws_hxBvybZTWJ2XW' },
  { name: 'Aliya', wishlistLink: 'https://www.amazon.com/registry/wishlist/1UJH19QLW22GH/ref=cm_sw_r_cp_ep_ws_pwBvybBH0883T' },
  { name: 'Elijah', wishlistLink: 'https://www.amazon.com/registry/wishlist/2FJHZEJG9IYAC/ref=cm_sw_r_cp_ep_ws_AvBvybT1JCEZ5' },
  { name: 'Ella', wishlistLink: 'https://www.amazon.com/registry/wishlist/14Q6IUHZPL1K5/ref=cm_sw_r_cp_ep_ws_8vmiAbSJ4Z79N' },
  { name: 'Micah', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/4YQS7HA1PG4Z?ref_=wl_share' },
  { name: 'Carrie', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/3FHZZVM2ZMVKM/ref=cm_go_nav_hz' },
  { name: 'Rock', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/10CGYA2B0I24Z?ref_=wl_share' },
  { name: 'Kayla', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/U0BNRXA6EMT4?ref_=wl_share' },
  { name: 'Matt', wishlistLink: 'https://www.amazon.com/registry/wishlist/2B91OR7T2SP7A/ref=cm_sw_r_cp_ep_ws_-8hjAb0KFHPS2' },
  { name: 'Sonny', wishlistLink: 'https://www.amazon.com/registry/wishlist/2JPFI5AG5ATOG/ref=cm_sw_r_cp_ep_ws_fFniAbJ9QVCVD' },
  { name: 'Barbara', wishlistLink: 'https://www.amazon.com/' },
  { name: 'Mike', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/1BGXRVLXFMMTU?ref=cm_sw_sm_r_un_un_1n9lQy3pOvl2W' },
  { name: 'Ashley', wishlistLink: 'https://www.amazon.com/registry/wishlist/QBNVEJLCHZ5T/ref=cm_sw_r_cp_ep_ws_NoyvybR17JHFE' },
  { name: 'Brittany', wishlistLink: 'https://www.amazon.com/registry/wishlist/2LBV3RMDXJWN4/ref=cm_sw_r_cp_ep_ws_ImyvybP71JAZZ' },
  { name: 'Wendy', wishlistLink: 'https://www.amazon.com/registry/wishlist/1G0ON3X87IXFO/ref=cm_sw_r_cp_ep_ws_0nyvyb2MF7YW8' },
  { name: 'Karl', wishlistLink: 'https://www.amazon.com/registry/wishlist/R6KPCB5ERVKZ/ref=cm_sw_r_cp_ep_ws_qcZvyb1YPZ8YG' },
  { name: 'Marilyn', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/YT96AFJS6SPO?ref_=wl_share' },
  { name: 'Bob', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/3Q9FSF6634XH3?ref_=wl_share' },
  { name: 'Nick', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/3KOIVNWWRFPZ2?ref_=wl_share' },
  { name: 'Nathaniel', wishlistLink: 'https://www.amazon.com/registry/wishlist/302M6ZBIB14Z6/ref=cm_sw_r_cp_ep_ws_5cZvybFVCMWG7' },
  { name: 'Chad', wishlistLink: 'https://www.amazon.com/' },
  { name: 'John', wishlistLink: 'https://www.amazon.com/' },
  { name: 'Roen', wishlistLink: 'https://www.amazon.com/' },
  { name: 'Noli', wishlistLink: 'https://www.amazon.com/' },
  { name: 'Tosh', wishlistLink: 'https://www.amazon.com/' },
  { name: 'Morgan', wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/3BV8D72FK9NEP?type=wishlist'},
];

export const migrateInitialData = async (): Promise<void> => {
  console.log('Starting data migration...');
  
  // Check if profiles already exist
  const { data: existingProfiles } = await supabase
    .from('profiles')
    .select('name');

  const existingNames = new Set(existingProfiles?.map(p => p.name) || []);

  const profilesToInsert = initialUsers
    .filter(user => !existingNames.has(user.name))
    .map(user => ({
      name: user.name,
      wishlist_link: user.wishlistLink,
      image_url: null,
      claimed_by: null,
      is_approved: false,
    }));

  if (profilesToInsert.length === 0) {
    console.log('All profiles already exist. No migration needed.');
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert(profilesToInsert)
    .select();

  if (error) {
    console.error('Error migrating data:', error);
    throw error;
  }

  console.log(`Successfully migrated ${data?.length || 0} profiles!`);
};

// Export function to be called from admin dashboard or console
export default migrateInitialData;

