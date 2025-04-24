import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SlackConfigForm } from "@/components/admin/slack-config-form"

export default function SlackConfigPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Slack Integration</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <SlackConfigForm />

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Setting Up Slack Integration</h2>

                <div className="prose max-w-none">
                  <h3>Step 1: Create a Slack App</h3>
                  <ol>
                    <li>
                      Go to{" "}
                      <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer">
                        api.slack.com/apps
                      </a>
                    </li>
                    <li>Click "Create New App" and choose "From scratch"</li>
                    <li>Enter a name for your app (e.g., "Security Alerts")</li>
                    <li>Select the workspace where you want to receive alerts</li>
                  </ol>

                  <h3>Step 2: Enable Incoming Webhooks</h3>
                  <ol>
                    <li>In your app settings, click on "Incoming Webhooks"</li>
                    <li>Toggle "Activate Incoming Webhooks" to On</li>
                    <li>Click "Add New Webhook to Workspace"</li>
                    <li>Select the channel where you want to receive alerts</li>
                    <li>Click "Allow" to authorize the app</li>
                  </ol>

                  <h3>Step 3: Copy Webhook URL</h3>
                  <ol>
                    <li>After authorization, you'll be redirected back to the Incoming Webhooks page</li>
                    <li>Find your new webhook URL in the list</li>
                    <li>Copy the webhook URL (it starts with https://hooks.slack.com/services/)</li>
                    <li>Paste it in the form on the left</li>
                  </ol>

                  <h3>Step 4: Test the Integration</h3>
                  <p>After saving your webhook URL, use the test button to send a test alert to your Slack channel.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Alert Types</h2>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-red-100 text-red-800 p-1 rounded">High</div>
                    <div>Critical security events that require immediate attention</div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 text-orange-800 p-1 rounded">Medium</div>
                    <div>Important security events that should be reviewed soon</div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="bg-yellow-100 text-yellow-800 p-1 rounded">Low</div>
                    <div>Routine security events for informational purposes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
