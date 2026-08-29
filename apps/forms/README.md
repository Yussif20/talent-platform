# 🎓 TalentBridge

**A comprehensive assessment platform for identifying twice-exceptional students**

TalentBridge is a professional educational tool designed to help teachers, parents, and specialists identify students who are both gifted and have learning challenges (twice-exceptional or 2e students). Our platform provides scientific, evidence-based assessments with multilingual support.

## ✨ Features

### 🔬 **Scientific Assessment**

- Evidence-based screening forms for teachers and parents
- Comprehensive behavioral analysis
- Instant scoring and classification
- Professional PDF reports

### 🌐 **Multilingual Support**

- **English** and **Arabic** language support
- Full RTL (Right-to-Left) layout for Arabic
- Culturally appropriate translations
- Seamless language switching

### 🎨 **Modern Design**

- Professional, accessible interface
- Light and dark theme support
- Responsive design for all devices
- Beautiful animations and transitions

### 📊 **Comprehensive Results**

- Detailed assessment reports
- Individualized intervention plans
- Educational recommendations
- Email delivery system

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Yussif20/talent-bridge.git
   cd talent-bridge
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
talent-bridge/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── layout.tsx      # Main layout
│   │   ├── page.tsx        # Homepage
│   │   ├── teacher-form/   # Teacher assessment form
│   │   ├── parent-form/    # Parent assessment form
│   │   ├── about/          # About page
│   │   ├── privacy/        # Privacy policy
│   │   └── terms/          # Terms of service
│   ├── globals.css         # Global styles
│   └── favicon.ico
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   ├── Logo.tsx            # Brand logo component
│   ├── Navigation.tsx      # Desktop navigation
│   ├── MobileNavigation.tsx # Mobile menu
│   ├── LanguageSelector.tsx # Language switcher
│   └── ThemeSwitcher.tsx   # Theme toggle
├── sections/
│   ├── HeroSection.tsx     # Homepage hero
│   ├── FeaturesSection.tsx # Features showcase
│   ├── AboutSection.tsx    # About 2e students
│   ├── TestimonialsSection.tsx # User testimonials
│   └── CTASection.tsx      # Call to action
├── i18n/
│   ├── request.ts          # i18n configuration
│   └── routing.ts          # Route handling
├── messages/
│   ├── en.json            # English translations
│   └── ar.json            # Arabic translations
└── public/
    ├── logo-light.png     # Light theme logo
    ├── logo-dark.png      # Dark theme logo
    └── ...
```

## 🛠️ Tech Stack

### **Frontend Framework**

- **Next.js 15.5.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - Latest React features

### **Styling & UI**

- **Tailwind CSS** - Utility-first CSS framework
- **CSS Custom Properties** - Theme variables
- **Responsive Design** - Mobile-first approach

### **Internationalization**

- **next-intl** - Type-safe internationalization
- **Locale routing** - `/en` and `/ar` routes
- **RTL support** - Right-to-left text direction

### **Development Tools**

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing

## 🎯 Assessment Forms

### 👨‍🏫 **Teacher Form**

- Behavioral observations in classroom settings
- Academic performance indicators
- Social interaction assessments
- Learning challenge identification

### 👨‍👩‍👧‍👦 **Parent Form**

- Home behavior observations
- Developmental history
- Family educational background
- Extracurricular interests and abilities

## 🌍 Internationalization

The application supports:

- **English (en)** - Default language
- **Arabic (ar)** - Full RTL support

### Adding New Languages

1. Create translation file in `messages/[locale].json`
2. Add locale to `i18n/routing.ts`
3. Update language selector in `components/LanguageSelector.tsx`

## 🎨 Theming

TalentBridge supports both light and dark themes:

- **Light Mode** - Professional blue and purple gradients
- **Dark Mode** - High contrast with accessibility focus
- **System Theme** - Automatically follows user's OS preference

## 📱 Responsive Design

- **Mobile** - Optimized for phones (320px+)
- **Tablet** - Perfect for iPad and similar devices
- **Desktop** - Full-featured experience
- **Large Screens** - Scales beautifully on 4K displays

## 🔒 Privacy & Security

- **No Personal Data Storage** - Privacy-focused design
- **Secure Assessment** - Professional-grade evaluation
- **Educational Purpose** - Screening tool only
- **GDPR Compliant** - European privacy standards

## 📈 Performance

- **Next.js Optimization** - Automatic code splitting
- **Image Optimization** - WebP format with fallbacks
- **Font Optimization** - Preloaded web fonts
- **Lighthouse Score** - 90+ on all metrics

## 🤝 Contributing

We welcome contributions to TalentBridge! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Educational psychologists who provided assessment criteria
- Teachers and parents who tested the platform
- The open-source community for excellent tools and libraries

## 📞 Support

For support, please contact:

- **Email**: support@talentbridge.edu
- **Issues**: [GitHub Issues](https://github.com/Yussif20/talent-bridge/issues)
- **Documentation**: [Wiki](https://github.com/Yussif20/talent-bridge/wiki)

## ⚠️ Important Notice

This assessment tool is designed for educational screening purposes only. It is not intended to provide a formal diagnosis or replace professional evaluation. Results should be interpreted by qualified educational professionals or psychologists.

---

**Made with ❤️ for twice-exceptional students and the educators who support them.**
