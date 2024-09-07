
# HouseMapper Project Documentation

## 1. Project Overview

1. **Company Name:**
   1. HouseMapper

2. **Website Domain:**
   1. [housemapper.co.uk](http://housemapper.co.uk)

3. **Primary Services:**
   1. Accurate building plans (PDF)
   2. Digital twins
   3. Virtual walkthroughs
   4. Point cloud files
   5. Sections and elevations (PDF)
   6. DWG files for architects

4. **Technology Stack:**
   1. Domain Registrar: GoDaddy
   2. Website Hosting: WebFlow
   3. Design & Branding: Adobe Illustrator (Brand assets stored in Google Drive, accessible via Google Slides)
   4. Client File Delivery: Google Drive (public links by default, private upon request)
   5. Database: Airtable (Tables and Interfaces for job management)
   6. Web App Development: Visual Studio Code (Synced to GitHub, deployed via Netlify)
   7. API Security: Buildship (for secure handling of API keys)
   8. Email Automation: Triggered via Airtable on job creation
   9. Payments: Stripe
   10. Calendar Bookings: Calendly
   11. Login System: Passwordless login via email link

## 2. Branding and Resources

1. **Brand Assets:**
   1. Created using Adobe Illustrator.

2. **Brand Pack:**
   1. The brand pack is available [here](https://docs.google.com/presentation/d/1QsirncrSTZ-WTyt-eqO4C6iwzWTcpIgpntBFr_jjSro/edit#slide=id.g7dd7304342_1_0).

3. **Website Content:**
   1. Most assets used on the website have been licensed from Envato Elements or created in-house.

4. **Brand Fonts:**
   1. Titles: Hubhead
   2. Everything Else: Urbanist

## 3. Web Platform

1. **Domain & Hosting:**
   1. Domain: Registered with GoDaddy.
   2. Hosting: Built and hosted with WebFlow.

2. **Web Apps:**
   1. Booking Form: A complex multi-step form with branching logic, designed in Visual Studio and embedded in the site.
   2. Client Dashboard: Allows clients to view project details, track progress, and access deliverables. Uses passwordless login for user convenience.

3. **Passwordless Login:**
   1. Users enter their email address and receive a login link, avoiding the need for password management.

## 4. Database Management

1. **Airtable Setup:**
   1. Tables: Manage job requests, staff assignments, and client details.
   2. Interfaces: Custom interfaces for staff to view job requests, job calendars, and detailed job information.
   3. Mobile App Usage: Staff can use the Airtable mobile app to access job details, including:
      - Number of rooms
      - Address and location type
      - Google Maps link for live navigation

2. **Automated Emails:**
   1. When a new job is added to the Airtable Jobs table, two emails are automatically sent:
      - To the assigned staff member for job approval.
      - To the client as a confirmation.

## 5. Development & Deployment

1. **Version Control:**
   1. GitHub: Visual Studio is synced with GitHub for version control.
   2. Deployment: Deployment to Netlify is automated upon commits to the main branch.

2. **API Key Management:**
   1. Buildship: Used to manage and secure API keys, preventing them from being exposed in the front-end code.

## 6. Integrations

1. **Payments:**
   1. Stripe: Used for handling payments from clients.

2. **Calendar Bookings:**
   1. Calendly: Currently used for managing calendar bookings.
   2. Google Calendar: Exploring options for integrating Google Calendar for staff availability checks.

## 7. Challenges and Considerations

1. **Calendar Integration:**
   1. Google Calendar: Current limitation is the inability to offer a booking slot based on availability of any one staff member rather than all staff members being available simultaneously.

2. **MemberStack and Monto:**
   1. Both installed on the WebFlow site but deemed insufficient for project needs.
   2. Moving towards a custom web app solution.

## 8. Additional Features

1. **OpenAI Assistant:**
   1. A chatbot powered by OpenAI has been embedded into the website.
   2. Details on the setup and prompt configuration to be provided later.

## 9. DevOps and Admin

1. **Analytics and Tracking:**
   1. Google Analytics is installed on the site.
   2. Google Tag Manager (GTM) is embedded at the top of every standard page template.
   3. Future plans include adding HotJar for user behavior analysis and Meta tracking pixels. These will be added via GTM.
   4. The site will require a cookie control solution.

2. **Booking Form:**
   1. The booking form will avoid cookies and use the site visitor's local storage to maintain sessions. This will ensure that the same booking form loaded on multiple pages maintains a user's progress and inputs.
   2. The form will screen clients by checking if the first half of their UK postcode matches an array of postcodes served.
   3. The list of regions served is managed via a Google Sheet by Housemapper Business Admins.
   4. The comprehensive list of UK postcodes can be updated from Doogal, which is refreshed every few months.

3. **Communication Tools:**
   1. An account with Twilio and SendGrid is set up for SMS and email autoresponders, connected to Netlify.
   2. Airtable is capable of sending its own emails.
   3. HTML email templates are not yet part of the brand pack and should be checked using Litmus or a similar tool (recommendation pending).

4. **AI Chatbot:**
   1. The current AI Chatbot is provided by Rispose (free tier).
   2. Current Cost: Free tier.
   3. The embed code is applied at the site header level.

## 10. Software as a Service (SaaS) Products and Costs

1. **Rispose AI Chatbot:**
   1. Cost: Free tier
   2. Account: James' Google login

2. **Miro:**
   1. Cost: Free tier
   2. Account: James' Google login

3. **Airtable:**
   1. Cost: Free tier
   2. Accounts:
      - James' Google login
      - neil@housemapper.co.uk (Admin)

4. **Twilio:**
   1. Cost: Free tier
   2. Account: James' Google login

5. **SendGrid:**
   1. Cost: Free tier
   2. Account: James' Google login

6. **Google Analytics:**
   1. Cost: Free tier
   2. Accounts:
      - James' Google login
      - neil@housemapper.co.uk (Admin)

7. **Google Tag Manager:**
   1. Cost: Free tier
   2. Accounts:
      - James' Google login
      - neil@housemapper.co.uk (Admin)

8. **Google Ads:**
   1. Cost: Free tier
   2. Account: James' Google login

9. **Meta Ads:**
   1. Cost: Free tier
   2. Account: Meta account for neil@housemapper.co.uk

10. **Instagram:**
    1. Cost: Free tier
    2. Account: Meta account for neil@housemapper.co.uk

11. **Facebook:**
    1. Cost: Free tier
    2. Account: Meta account for neil@housemapper.co.uk

12. **WhatsApp:**
    1. Cost: Free tier
    2. Account: Meta account for neil@housemapper.co.uk

13. **Netlify:**
   1. Cost: Free tier
   2. Account: James' Github login

14. **Calendly:**
   1. Cost: Free tier
   2. Account: James' Google login

15. **Buildship:**
    1. Cost: Free tier
    2. Account: James' Google login

16. **Litmus (Pending Recommendation):**
    1. Cost: Free tier
    2. Account: James' Google login

17. **Stripe:**
    1. Cost: Free tier
    2. Accounts:
       - James' Google login
       - neil@hawlings.com (Sole Admin)

18. **Google Looker Studio:**
    1. Cost: Free tier
    2. Account: James' Google login
