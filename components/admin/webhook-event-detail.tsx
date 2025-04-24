"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WebhookEventWithLogs } from "@/types/webhook"
import { Code } from "@/components/ui/code"
import { formatDistanceToNow, format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface WebhookEventDetailProps {
  event: WebhookEventWithLogs
}

export function WebhookEventDetail({ event }: WebhookEventDetailProps) {
  const [activeTab, setActiveTab] = useState("payload")

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="payload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="payload">Payload</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="logs">Delivery Logs ({event.logs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="payload" className="mt-0">
            <Code language="json">{JSON.stringify(event.payload, null, 2)}</Code>
          </TabsContent>

          <TabsContent value="response" className="mt-0">
            {event.responseBody ? (
              <Code language="json">{event.responseBody}</Code>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No response data available</div>
            )}
          </TabsContent>

          <TabsContent value="logs" className="mt-0">
            {event.logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No delivery logs available</div>
            ) : (
              <div className="space-y-4">
                {event.logs.map((log) => (
                  <div key={log.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">Attempt #{log.attemptNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(log.createdAt, "PPpp")}
                        <span className="ml-2">({formatDistanceToNow(log.createdAt, { addSuffix: true })})</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Request</h4>
                        <div className="text-sm mb-2">
                          <span className="font-medium">URL:</span> {log.requestUrl}
                        </div>
                        {log.requestHeaders && (
                          <div className="mb-2">
                            <div className="text-sm font-medium">Headers:</div>
                            <Code language="json" className="text-xs">
                              {JSON.stringify(log.requestHeaders, null, 2)}
                            </Code>
                          </div>
                        )}
                        {log.requestBody && (
                          <div>
                            <div className="text-sm font-medium">Body:</div>
                            <Code language="json" className="text-xs">
                              {log.requestBody}
                            </Code>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Response</h4>
                        {log.responseCode ? (
                          <>
                            <div className="text-sm mb-2">
                              <span className="font-medium">Status:</span>{" "}
                              <Badge
                                variant={log.responseCode >= 200 && log.responseCode < 300 ? "outline" : "destructive"}
                              >
                                {log.responseCode}
                              </Badge>
                            </div>
                            {log.responseHeaders && (
                              <div className="mb-2">
                                <div className="text-sm font-medium">Headers:</div>
                                <Code language="json" className="text-xs">
                                  {JSON.stringify(log.responseHeaders, null, 2)}
                                </Code>
                              </div>
                            )}
                            {log.responseBody && (
                              <div>
                                <div className="text-sm font-medium">Body:</div>
                                <Code language="json" className="text-xs">
                                  {log.responseBody}
                                </Code>
                              </div>
                            )}
                          </>
                        ) : log.errorMessage ? (
                          <div className="text-red-600">{log.errorMessage}</div>
                        ) : (
                          <div className="text-muted-foreground">No response data available</div>
                        )}
                      </div>
                    </div>

                    {log.duration && (
                      <div className="mt-2 text-sm text-muted-foreground">Request took {log.duration}ms</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
