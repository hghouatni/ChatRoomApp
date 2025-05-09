import { Component, type ElementRef, EventEmitter, Input, OnChanges, type OnInit, Output, SimpleChanges, ViewChild } from "@angular/core"
import { ChatService } from "../../services/chat.service"
import { MediaService } from "../../services/media.service"

@Component({
  selector: "app-chat-message",
  templateUrl: "./chat-message.component.html",
  styleUrls: ["./chat-message.component.css"],
})
export class ChatMessageComponent implements OnChanges {
  @Input() messages: {
    senderInitial: string
    text: string
    status: string
    isUser2: boolean
    timestamp: number
    type?: string
    mediaUrl?: string
  }[] = []
  @Input() chatId = 0
  @Input() senderId = 0
  @Input() receiverId = 0
  @Input() user: any = null

  @Output() messageSent = new EventEmitter<any>()

  messageContent = ""
  @ViewChild("messagesContainer") messagesContainer!: ElementRef
  @ViewChild("fileInput") fileInput!: ElementRef
  @ViewChild("audioInput") audioInput!: ElementRef

  isRecording = false
  audioRecorder: MediaRecorder | null = null
  audioChunks: Blob[] = []
  recordingTime = 0
  recordingInterval: any

  showAttachmentOptions = false
  isUploading = false

  mediaCache: Map<string, string> = new Map()
  loadingMedia: Set<string> = new Set()

  constructor(
    private chatService: ChatService,
    private mediaService: MediaService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.messages.forEach((message) => {
        if (message.mediaUrl && (message.type === 'image' || message.type === 'audio')) {
          this.getSecureMediaUrl(message.mediaUrl);
        }
      });
    }
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      const timestamp = new Date().toISOString()
      this.chatService
        .sendMessage(this.chatId, this.senderId, this.receiverId, this.messageContent, timestamp)
        .subscribe(
          (response) => {
            const newMessage = {
              senderInitial: response.sender.name.charAt(0),
              text: response.content,
              timestamp: response.timestamp,
              status: "Sent",
              isUser2: response.sender.id !== this.senderId,
              type: "text",
            }

            this.messageSent.emit(newMessage)
            this.messageContent = ""
          },
          (error) => {
            console.error("Error sending message:", error)
          },
        )
    }
  }

  toggleAttachmentOptions(): void {
    this.showAttachmentOptions = !this.showAttachmentOptions
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.uploadMedia(file, "image")
      input.value = "" // Reset input
    }
  }

  startRecording(): void {
    this.isRecording = true
    this.audioChunks = []
    this.recordingTime = 0

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.audioRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm' // Use a widely supported format
        })

        this.audioRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data)
          }
        }

        this.audioRecorder.onstop = () => {
          // Create blob with proper MIME type
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
          this.uploadMedia(audioBlob, "audio")
        }

        this.audioRecorder.start(1000) // Collect data every second

        this.recordingInterval = setInterval(() => {
          this.recordingTime++
        }, 1000)
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error)
        this.isRecording = false
      })
  }

  stopRecording(): void {
    if (this.audioRecorder && this.isRecording) {
      this.audioRecorder.stop()
      this.isRecording = false
      clearInterval(this.recordingInterval)

      this.audioRecorder.stream.getTracks().forEach((track) => track.stop())
    }
  }

  cancelRecording(): void {
    if (this.audioRecorder && this.isRecording) {
      this.audioRecorder.stop()
      this.isRecording = false
      clearInterval(this.recordingInterval)
      this.audioChunks = []

      this.audioRecorder.stream.getTracks().forEach((track) => track.stop())
    }
  }

  uploadMedia(file: File | Blob, type: string): void {
    this.isUploading = true

    // Create a proper file with correct extension and MIME type
    const mediaFile = file instanceof Blob && !(file instanceof File)
      ? new File([file], `recording-${Date.now()}.webm`, { 
          type: file.type || 'audio/webm' 
        })
      : file

    this.mediaService.uploadMedia(this.chatId, this.senderId, this.receiverId, mediaFile, type).subscribe(
      (response) => {
        const newMessage = {
          senderInitial: response.sender.name.charAt(0),
          text: response.content || (type === 'audio' ? 'Audio message' : 'Image'),
          timestamp: response.timestamp,
          status: "Sent",
          isUser2: false,
          type: response.type,
          mediaUrl: response.mediaUrl,
        }

        // Prefetch the media URL right after upload
        if (newMessage.mediaUrl) {
          this.getSecureMediaUrl(newMessage.mediaUrl)
        }

        this.messageSent.emit(newMessage)
        this.isUploading = false
        this.showAttachmentOptions = false
      },
      (error) => {
        console.error("Error uploading media:", error)
        this.isUploading = false
      },
    )
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  isToday(timestamp: number): boolean {
    const messageDate = new Date(timestamp)
    const today = new Date()

    return (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    )
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom()
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement
      container.scrollTop = container.scrollHeight
    }
  }

  getSecureMediaUrl(mediaUrl: string | undefined): string {
    if (!mediaUrl) return ""    
    if (this.mediaCache.has(mediaUrl)) {
      return this.mediaCache.get(mediaUrl) || ""
    }

    this.loadingMedia.add(mediaUrl)

    this.mediaService.getMediaAsBlob(mediaUrl).subscribe(
      (blob) => {
        // Create object URL with the correct MIME type based on message type
        const objectUrl = URL.createObjectURL(blob)
        this.mediaCache.set(mediaUrl, objectUrl)
        this.loadingMedia.delete(mediaUrl)
      },
      (error) => {
        console.error("Error loading media:", error)
        this.loadingMedia.delete(mediaUrl)
      },
    )

    return ""
  }

  isMediaLoading(mediaUrl: string | undefined): boolean {
    return mediaUrl ? this.loadingMedia.has(mediaUrl) : false
  }

  ngOnDestroy(): void {
    // Clean up object URLs to prevent memory leaks
    this.mediaCache.forEach((objectUrl) => {
      URL.revokeObjectURL(objectUrl)
    })
    
    // Make sure any recording is stopped
    if (this.isRecording) {
      this.cancelRecording()
    }
    
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval)
    }
  }
}