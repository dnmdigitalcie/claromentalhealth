"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import type { WebhookDestination } from "@/types/webhook"
import { getWebhookDestinations, saveWebhookDestination, deleteWebhookDestination } from "@/lib/webhook-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Plus, Trash2, Edit, ExternalLink } from "lucide-react"

interface WebhookDestinationsListProps {
  refreshTrigger: number
  onError: (message: string) => void
}

export function WebhookDestinationsList({ refreshTrigger, onError }: WebhookDestinationsListProps) {
  const [destinations, setDestinations] = useState<WebhookDestination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<Record<string, boolean>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [destinationToDelete, setDestinationToDelete] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentDestination, setCurrentDestination] = useState<Partial<WebhookDestination> | null>(null)

  // Available event types
  const availableEventTypes = [
    { id: "user.created", label: "User Created" },
    { id: "user.updated", label: "User Updated" },
    { id: "user.deleted", label: "User Deleted" },
    { id: "course.published", label: "Course Published" },
    { id: "course.updated", label: "Course Updated" },
    { id: "enrollment.created", label: "Enrollment Created" },
    { id: "lesson.completed", label: "Lesson Completed" },
    { id: "assessment.submitted", label: "Assessment Submitted" },
  ]

  useEffect(() => {
    async function fetchDestinations() {
      setIsLoading(true)
      try {
        const data = await getWebhookDestinations()
        setDestinations(data)
      } catch (error) {
        console.error("Error fetching webhook destinations:", error)
        onError("Failed to load webhook destinations. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [refreshTrigger, onError])

  const handleToggleActive = async (id: string, active: boolean) => {
    setIsUpdatingStatus((prev) => ({ ...prev, [id]: true }))
    try {
      const destination = destinations.find((d) => d.id === id)
      if (!destination) return

      const updated = await saveWebhookDestination({
        ...destination,
        active,
      })

      if (updated) {
        setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, active } : d)))
      } else {
        onError("Failed to update webhook destination status.")
      }
    } catch (error) {
      console.error("Error updating webhook destination status:", error)
      onError("An error occurred while updating the webhook destination.")
    } finally {
      setIsUpdatingStatus((prev) => ({ ...prev, [id]: false }))
    }
  }

  const confirmDelete = (id: string) => {
    setDestinationToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!destinationToDelete) return

    setIsDeleting((prev) => ({ ...prev, [destinationToDelete]: true }))
    try {
      const success = await deleteWebhookDestination(destinationToDelete)
      if (success) {
        setDestinations((prev) => prev.filter((d) => d.id !== destinationToDelete))
      } else {
        onError("Failed to delete webhook destination.")
      }
    } catch (error) {
      console.error("Error deleting webhook destination:", error)
      onError("An error occurred while deleting the webhook destination.")
    } finally {
      setIsDeleting((prev) => ({ ...prev, [destinationToDelete]: false }))
      setDestinationToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (destination?: WebhookDestination) => {
    setCurrentDestination(
      destination || {
        name: "",
        url: "",
        secret: "",
        eventTypes: [],
        headers: {},
        active: true,
        retryStrategy: "exponential",
        maxRetries: 3,
      },
    )
    setEditDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!currentDestination) return

    setIsSubmitting(true)
    try {
      const saved = await saveWebhookDestination(currentDestination)
      if (saved) {
        if (currentDestination.id) {
          setDestinations((prev) => prev.map((d) => (d.id === saved.id ? saved : d)))
        } else {
          setDestinations((prev) => [...prev, saved])
        }
        setEditDialogOpen(false)
      } else {
        onError("Failed to save webhook destination.")
      }
    } catch (error) {
      console.error("Error saving webhook destination:", error)
      onError("An error occurred while saving the webhook destination.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEventTypeToggle = (eventType: string) => {
    if (!currentDestination) return

    const eventTypes = currentDestination.eventTypes || []
    const updatedEventTypes = eventTypes.includes(eventType)
      ? eventTypes.filter((t) => t !== eventType)
      : [...eventTypes, eventType]

    setCurrentDestination({
      ...currentDestination,
      eventTypes: updatedEventTypes,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => openEditDialog()}>
          <Plus className="h-4 w-4 mr-2" /> Add Destination
        </Button>
      </div>

      {destinations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No webhook destinations configured.</p>
          <Button variant="outline" className="mt-4" onClick={() => openEditDialog()}>
            <Plus className="h-4 w-4 mr-2" /> Add Your First Destination
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Event Types</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell className="font-medium">{destination.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="truncate max-w-[200px]">{destination.url}</span>
                      <a
                        href={destination.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="sr-only">Open URL</span>
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {destination.eventTypes.slice(0, 3).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {destination.eventTypes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{destination.eventTypes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={destination.active}
                      disabled={isUpdatingStatus[destination.id]}
                      onCheckedChange={(checked) => handleToggleActive(destination.id, checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(destination)}>
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmDelete(destination.id)}
                        disabled={isDeleting[destination.id]}
                        className="text-red-500 hover:text-red-700"
                      >
                        {isDeleting[destination.id] ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this webhook destination. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentDestination?.id ? "Edit Webhook Destination" : "Add Webhook Destination"}</DialogTitle>
            <DialogDescription>Configure where webhook events will be sent</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentDestination?.name || ""}
                onChange={(e) => setCurrentDestination((prev) => ({ ...prev!, name: e.target.value }))}
                className="col-span-3"
                placeholder="My Webhook"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={currentDestination?.url || ""}
                onChange={(e) => setCurrentDestination((prev) => ({ ...prev!, url: e.target.value }))}
                className="col-span-3"
                placeholder="https://example.com/webhook"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secret" className="text-right">
                Secret
              </Label>
              <Input
                id="secret"
                value={currentDestination?.secret || ""}
                onChange={(e) => setCurrentDestination((prev) => ({ ...prev!, secret: e.target.value }))}
                className="col-span-3"
                placeholder="Optional: Used for signature verification"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Event Types</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {availableEventTypes.map((eventType) => (
                  <div key={eventType.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`event-${eventType.id}`}
                      checked={(currentDestination?.eventTypes || []).includes(eventType.id)}
                      onCheckedChange={() => handleEventTypeToggle(eventType.id)}
                    />
                    <Label htmlFor={`event-${eventType.id}`} className="text-sm font-normal">
                      {eventType.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="headers" className="text-right">
                Headers
              </Label>
              <Textarea
                id="headers"
                value={currentDestination?.headers ? JSON.stringify(currentDestination.headers, null, 2) : ""}
                onChange={(e) => {
                  try {
                    const headers = e.target.value ? JSON.parse(e.target.value) : {}
                    setCurrentDestination((prev) => ({ ...prev!, headers }))
                  } catch (error) {
                    // Invalid JSON, just store as string for now
                    setCurrentDestination((prev) => ({ ...prev!, headersText: e.target.value }))
                  }
                }}
                className="col-span-3"
                placeholder='{"X-Custom-Header": "value"}'
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="retry-strategy" className="text-right">
                Retry Strategy
              </Label>
              <div className="col-span-3">
                <select
                  id="retry-strategy"
                  value={currentDestination?.retryStrategy || "exponential"}
                  onChange={(e) =>
                    setCurrentDestination((prev) => ({ ...prev!, retryStrategy: e.target.value as any }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="exponential">Exponential Backoff</option>
                  <option value="linear">Linear Backoff</option>
                  <option value="fixed">Fixed Delay</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max-retries" className="text-right">
                Max Retries
              </Label>
              <Input
                id="max-retries"
                type="number"
                min={0}
                max={10}
                value={currentDestination?.maxRetries || 3}
                onChange={(e) =>
                  setCurrentDestination((prev) => ({ ...prev!, maxRetries: Number.parseInt(e.target.value) }))
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={currentDestination?.active !== false}
                  onCheckedChange={(checked) => setCurrentDestination((prev) => ({ ...prev!, active: checked }))}
                />
                <Label htmlFor="active" className="text-sm font-normal">
                  {currentDestination?.active !== false ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
