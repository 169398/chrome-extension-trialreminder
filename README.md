# Trial Reminder Chrome Extension

A Chrome extension to help you track and manage your free trial subscriptions, ensuring you never forget to cancel before being charged.

![Trial Reminder Screenshot](docs/screenshot.png)

## Features

- 🕒 Track multiple free trials with start dates and durations
- 🔔 Get notifications 2 days before trials expire
- 📊 Dashboard with trial statistics and potential savings
- 🌓 Dark/Light mode support
- 💾 Sync data across devices using Chrome Storage
- 🔍 Auto-detection of trial signup pages (supported services)
- 📱 Responsive design for the popup interface

## Installation

### From Chrome Web Store
*(Coming soon)*

### Local Development Installation
1. Clone the repository:

```bash
git clone https://github.com/yourusername/trial-reminder.git
cd trial-reminder
```

2. Install dependencies:

```bash
npm install
```

3. Build the extension:

```bash
npm run build:extension
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `out` directory from your project folder

## Development

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Available Scripts

```bash
# Start development server
npm run dev

# Build the extension
npm run build:extension

# Run linting
npm run lint

# Start production server
npm run start
```

### Project Structure
```
trial-reminder/
├── public/
│   ├── background.js     # Extension background script
│   ├── manifest.json     # Extension manifest
│   └── icons/           # Extension icons
├── src/
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions
└── ...configuration files
```

### Technology Stack
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Chrome Extension APIs](https://developer.chrome.com/docs/extensions/reference/) - Browser integration

## Features in Detail

### Trial Tracking
- Add trials with service name, start date, and duration
- Automatic status updates (active/expired)
- Edit or delete existing trials
- Sort and filter trials by various criteria

### Notifications
- Automatic notifications 2 days before trial expiration
- Customizable notification settings
- Click notifications to open extension popup

### Auto-Detection
Currently supports auto-detection for:
- Netflix
- (Add other supported services)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Privacy

This extension:
- Only stores trial data in your Chrome sync storage
- Does not collect any personal information
- Does not send data to any external servers
- Only requires necessary permissions for core functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons provided by [Lucide Icons](https://lucide.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Theme inspiration from [Vercel](https://vercel.com)

## Support

If you encounter any issues or have questions:
- Open an issue in the GitHub repository
- Contact: kulubiidris@gmail.com

---

Made with ❤️ by [@Idris Kulubi](https://github.com/169398)
