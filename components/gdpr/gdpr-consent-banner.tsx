"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ConsentSettings {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export function GdprConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    necessary: true, // Always required
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if consent has been given before
    const consentCookie = document.cookie.split("; ").find((row) => row.startsWith("gdpr-consent="))

    if (!consentCookie) {
      // No consent cookie found, show the banner
      setShowBanner(true)
    } else {
      // Parse the consent settings
      try {
        const settings = JSON.parse(decodeURIComponent(consentCookie.split("=")[1]))
        setConsentSettings(settings)
      } catch (error) {
        console.error("Error parsing consent cookie:", error)
        setShowBanner(true)
      }
    }
  }, [])

  const setConsentCookie = (settings: ConsentSettings) => {
    const cookieValue = encodeURIComponent(JSON.stringify(settings))
    document.cookie = `gdpr-consent=${cookieValue}; max-age=${365 * 24 * 60 * 60}; path=/` // Expires in 1 year
  }

  const handleAcceptAll = () => {
    const allConsented: ConsentSettings = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    setConsentSettings(allConsented)
    setConsentCookie(allConsented)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const necessaryOnly: ConsentSettings = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    setConsentSettings(necessaryOnly)
    setConsentCookie(necessaryOnly)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    setConsentCookie(consentSettings)
    setShowPreferences(false)
    setShowBanner(false)
  }

  const toggleConsent = (type: keyof ConsentSettings) => {
    setConsentSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-100 border-t border-gray-200 p-4 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm">
                We use cookies to improve your experience on our site. By continuing to use our site, you agree to our
                use of cookies.
              </p>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreferences(true)}>
                Customize
              </Button>
              <Button size="sm" onClick={handleRejectAll}>
                Reject All
              </Button>
              <Button size="sm" onClick={handleAcceptAll}>
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Consent Preferences</DialogTitle>
            <DialogDescription>Manage your consent preferences for cookies and similar technologies.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="necessary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="necessary">Necessary</TabsTrigger>
              <TabsTrigger value="functional">Functional</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
            <TabsContent value="necessary" className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox checked={true} disabled id="necessary" />
                <Label htmlFor="necessary">Strictly Necessary</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                These cookies are essential for the website to function properly.
              </p>
            </TabsContent>
            <TabsContent value="functional" className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={consentSettings.functional}
                  onCheckedChange={() => toggleConsent("functional")}
                  id="functional"
                />
                <Label htmlFor="functional">Functional Cookies</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                These cookies allow the website to remember your preferences and provide enhanced features.
              </p>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={consentSettings.analytics}
                  onCheckedChange={() => toggleConsent("analytics")}
                  id="analytics"
                />
                <Label htmlFor="analytics">Analytics Cookies</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                These cookies help us understand how visitors interact with our website by collecting and reporting
                information anonymously.
              </p>
            </TabsContent>
            <TabsContent value="marketing" className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={consentSettings.marketing}
                  onCheckedChange={() => toggleConsent("marketing")}
                  id="marketing"
                />
                <Label htmlFor="marketing">Marketing Cookies</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                These cookies are used to track visitors across websites. The intention is to display ads that are
                relevant and engaging for the individual user.
              </p>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button onClick={handleSavePreferences}>Save preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
