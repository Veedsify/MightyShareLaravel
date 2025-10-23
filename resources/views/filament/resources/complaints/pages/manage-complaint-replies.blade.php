<x-filament-panels::page>
      <div class="space-y-6">
            <!-- Complaint Details -->
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:shadow-none">
                  <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">{{ $this->record->title }}</h2>
                  <div class="grid gap-4 md:grid-cols-2">
                        <div>
                              <p class="text-sm font-medium text-gray-700 dark:text-gray-400">Ticket Number</p>
                              <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $this->record->ticket_number }}</p>
                        </div>
                        <div>
                              <p class="text-sm font-medium text-gray-700 dark:text-gray-400">Status</p>
                              <span class="inline-block rounded-full px-3 py-1 text-xs font-medium
                                    {{ $this->record->status === 'open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 
                                       ($this->record->status === 'in_progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : 
                                       ($this->record->status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300')) }}">
                                    {{ ucfirst(str_replace('_', ' ', $this->record->status)) }}
                              </span>
                        </div>
                        <div>
                              <p class="text-sm font-medium text-gray-700 dark:text-gray-400">Priority</p>
                              <span class="inline-block rounded-full px-3 py-1 text-xs font-medium
                                    {{ $this->record->priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 
                                       ($this->record->priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : 
                                       ($this->record->priority === 'normal' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300')) }}">
                                    {{ ucfirst($this->record->priority) }}
                              </span>
                        </div>
                        <div>
                              <p class="text-sm font-medium text-gray-700 dark:text-gray-400">Category</p>
                              <p class="text-gray-900 dark:text-gray-100">{{ ucfirst($this->record->category) }}</p>
                        </div>
                        <div class="md:col-span-2">
                              <p class="text-sm font-medium text-gray-700 dark:text-gray-400">Description</p>
                              <p class="mt-2 whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ $this->record->description }}</p>
                        </div>
                  </div>
            </div>

            <!-- Conversation Thread -->
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:shadow-none">
                  <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Conversation ({{ $this->record->replies->count() }})</h3>
                  
                  <div class="mb-6 space-y-4 max-h-96 overflow-y-auto">
                        @if($this->record->replies->count() > 0)
                              @foreach($this->record->replies as $reply)
                                    <div class="border-l-4 
                                          {{ $reply->type === 'note' ? 'border-blue-500 dark:border-blue-400' : 
                                             ($reply->type === 'resolution' ? 'border-green-500 dark:border-green-400' : 'border-gray-300 dark:border-gray-600') }} 
                                          bg-gray-50 dark:bg-gray-800 p-4">
                                          <div class="mb-2 flex items-start justify-between">
                                                <div>
                                                      <p class="font-semibold text-gray-900 dark:text-gray-100">{{ $reply->user->name }}</p>
                                                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ $reply->created_at->format('M d, Y g:i A') }}</p>
                                                </div>
                                                <span class="inline-block rounded-full px-3 py-1 text-xs font-medium
                                                      {{ $reply->type === 'note' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 
                                                         ($reply->type === 'resolution' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300') }}">
                                                      {{ ucfirst(str_replace('_', ' ', $reply->type)) }}
                                                </span>
                                          </div>
                                          <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ $reply->message }}</p>
                                    </div>
                              @endforeach
                        @else
                              <p class="text-center text-gray-500 py-8 dark:text-gray-400">No replies yet</p>
                        @endif
                  </div>
            </div>

            <!-- Add Reply Form -->
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:shadow-none">
                  <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Add Reply</h3>
                  
                  <form wire:submit="addReply" class="space-y-4">
                        <div>
                              <label for="replyType" class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">Type</label>
                              <select wire:model="replyType" id="replyType" class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                                    <option value="reply">Reply to User</option>
                                    <option value="note">Internal Note</option>
                                    <option value="resolution">Resolution</option>
                              </select>
                        </div>

                        <div>
                              <label for="replyMessage" class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">Message</label>
                              <textarea wire:model="replyMessage" id="replyMessage" rows="5" placeholder="Enter your reply here..." class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"></textarea>
                        </div>

                        <div class="flex gap-3">
                              <button type="submit" class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800">
                                    Send Reply
                              </button>
                        </div>
                  </form>
            </div>
      </div>
</x-filament-panels::page>
