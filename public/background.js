chrome.alarms.create('checkTrials', {
  periodInMinutes: 1440 // 24 hours
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkTrials') {
    checkTrialExpirations();
  }
});

async function checkTrialExpirations() {
  const { trials = [] } = await chrome.storage.sync.get('trials');
  
  trials.forEach(trial => {
    const expirationDate = new Date(trial.startDate);
    expirationDate.setDate(expirationDate.getDate() + trial.duration);
    
    const twoDaysBeforeExpiration = new Date(expirationDate);
    twoDaysBeforeExpiration.setDate(twoDaysBeforeExpiration.getDate() - 2);
    
    const today = new Date();
    
    if (today.toDateString() === twoDaysBeforeExpiration.toDateString()) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Trial Ending Soon ⏰',
        message: `Your ${trial.serviceName} trial will end in 2 days. Consider canceling if you don't want to be charged.`
      });
    }
  });
}

const trialPatterns = [
  {
    domain: "netflix.com",
    paths: ["/signup", "/register"],
    duration: 30,
    name: "Netflix",
    cancelUrl: "https://netflix.com/cancelplan"
  },
  {
    domain: "spotify.com",
    paths: ["/premium"],
    duration: 30,
    name: "Spotify Premium",
    cancelUrl: "https://spotify.com/account/subscription"
  },
  {
    domain: "amazon.com",
    paths: ["/prime"],
    duration: 30,
    name: "Amazon Prime",
    cancelUrl: "https://amazon.com/gp/prime/pipeline/memberships"
  },
  {
    domain: "hulu.com",
    paths: ["/start", "/signup"],
    duration: 30,
    name: "Hulu",
    cancelUrl: "https://secure.hulu.com/account/cancel"
  },
  {
    domain: "disneyplus.com",
    paths: ["/signup"],
    duration: 7,
    name: "Disney+",
    cancelUrl: "https://disneyplus.com/account/subscription"
  },
  {
    domain: "apple.com",
    paths: ["/apple-music", "/trial"],
    duration: 30,
    name: "Apple Music",
    cancelUrl: "https://music.apple.com/account"
  },
  {
    domain: "adobe.com",
    paths: ["/creativecloud/plans", "/subscribe"],
    duration: 7,
    name: "Adobe Creative Cloud",
    cancelUrl: "https://account.adobe.com/plans"
  },
  {
    domain: "microsoft.com",
    paths: ["/en-us/microsoft-365/try"],
    duration: 30,
    name: "Microsoft 365",
    cancelUrl: "https://account.microsoft.com/services"
  },
  {
    domain: "canva.com",
    paths: ["/pro/signup"],
    duration: 30,
    name: "Canva Pro",
    cancelUrl: "https://canva.com/account/billing"
  },
  {
    domain: "zendesk.com",
    paths: ["/signup", "/trial"],
    duration: 14,
    name: "Zendesk",
    cancelUrl: "https://support.zendesk.com/hc/en-us/articles/360001252567"
  },
  {
    domain: "audible.com",
    paths: ["/signup"],
    duration: 30,
    name: "Audible",
    cancelUrl: "https://audible.com/account/cancel"
  },
  {
    domain: "dropbox.com",
    paths: ["/business/try"],
    duration: 30,
    name: "Dropbox Business",
    cancelUrl: "https://dropbox.com/account/billing"
  }
];

// Enhanced trial detection
chrome.webNavigation.onCompleted.addListener(async (details) => {
  const url = new URL(details.url);
  
  const matchedService = trialPatterns.find(pattern => 
    url.hostname.includes(pattern.domain) && 
    pattern.paths.some(path => url.pathname.includes(path))
  );

  if (matchedService) {
    const trial = {
      id: Date.now().toString(),
      serviceName: matchedService.name,
      startDate: new Date().toISOString(),
      duration: matchedService.duration,
      url: details.url,
      cancelUrl: matchedService.cancelUrl,
      status: 'active'
    };
    
    const { trials = [] } = await chrome.storage.sync.get('trials');
    trials.push(trial);
    await chrome.storage.sync.set({ trials });
    
    // Show notification of trial detection
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: '🔔 New Trial Detected',
      message: `We detected that you started a ${matchedService.name} trial. It has been added to your dashboard.`
    });
  }
}); 