export interface YahooAffiliateLink {
  boardId: string;
  searchQuery: string;
  affiliateUrl?: string;
  checkedAt?: string;
}

export const YAHOO_AFFILIATE_LINKS: Record<string, YahooAffiliateLink> = {
  'lost-puddle-jumper-25': { boardId: 'lost-puddle-jumper-25', searchQuery: "Lost Original Puddle Jumper 25 サーフボード" },
  'ci-rocket-wide': { boardId: 'ci-rocket-wide', searchQuery: "Channel Islands Rocket Wide サーフボード" },
  'hs-hypto-krypto': { boardId: 'hs-hypto-krypto', searchQuery: "Haydenshapes Hypto Krypto サーフボード" },
  'ci-twin-pin': { boardId: 'ci-twin-pin', searchQuery: "Channel Islands Twin Pin サーフボード" },
  'firewire-dominator-2': { boardId: 'firewire-dominator-2', searchQuery: "Firewire Dominator 2.0 サーフボード" },
  'firewire-mashup': { boardId: 'firewire-mashup', searchQuery: "Firewire Mashup サーフボード" },
  'firewire-seaside': { boardId: 'firewire-seaside', searchQuery: "Firewire Seaside サーフボード" },
  'firewire-seaside-beyond': { boardId: 'firewire-seaside-beyond', searchQuery: "Firewire Seaside Beyond サーフボード" },
  'ci-happy-everyday': { boardId: 'ci-happy-everyday', searchQuery: "Channel Islands Happy Everyday サーフボード" },
  'js-black-baron-21': { boardId: 'js-black-baron-21', searchQuery: "JS Industries Black Baron 2.1 サーフボード" },
  'ci-better-everyday': { boardId: 'ci-better-everyday', searchQuery: "Channel Islands Better Everyday サーフボード" },
  'ci-two-happy': { boardId: 'ci-two-happy', searchQuery: "Channel Islands Two Happy サーフボード" },
  'ci-mid': { boardId: 'ci-mid', searchQuery: "Channel Islands CI Mid サーフボード" },
  'firewire-tj-pro-mid': { boardId: 'firewire-tj-pro-mid', searchQuery: "Firewire Taylor Jensen Pro Mid サーフボード" },
};

export function yahooAffiliateFor(boardId: string): YahooAffiliateLink | undefined {
  return YAHOO_AFFILIATE_LINKS[boardId];
}
