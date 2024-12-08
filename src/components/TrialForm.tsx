"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Trial {
  id: string;
  serviceName: string;
  startDate: string;
  duration: number;
  url?: string;
  cancelUrl?: string;
  status: 'active' | 'cancelled' | 'expired';
  notes?: string;
}

export function TrialForm() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [editingTrial, setEditingTrial] = useState<Trial | null>(null);
  const [sortBy, setSortBy] = useState<'startDate' | 'serviceName' | 'status'>('startDate');
  const [filterStatus, setFilterStatus] = useState<Trial['status'] | 'all'>('all');
  const [newTrial, setNewTrial] = useState({
    serviceName: '',
    startDate: '',
    duration: 30
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load trials from Chrome storage
    chrome.storage.sync.get('trials', (data) => {
      setTrials(data.trials || []);
    });

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.trials) {
        setTrials(changes.trials.newValue);
      }
    });
  }, []);

  // Sort and filter trials
  const sortedAndFilteredTrials = useMemo(() => {
    let filtered = trials;
    if (filterStatus !== 'all') {
      filtered = trials.filter(trial => trial.status === filterStatus);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'startDate':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'serviceName':
          return a.serviceName.localeCompare(b.serviceName);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [trials, sortBy, filterStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trial: Trial = {
      id: Date.now().toString(),
      ...newTrial,
      status: 'active'
    };

    const updatedTrials = [...trials, trial];
    await chrome.storage.sync.set({ trials: updatedTrials });
    
    setNewTrial({
      serviceName: '',
      startDate: '',
      duration: 30
    });

    toast({
      title: "Trial added successfully",
      description: "Your trial has been added to the list.",
    });
  };

  const handleDelete = async (id: string) => {
    const updatedTrials = trials.filter(trial => trial.id !== id);
    await chrome.storage.sync.set({ trials: updatedTrials });
    toast({
      title: "Trial removed successfully",
      description: "Your trial has been removed from the list.",
    });
  };

  const handleEdit = async (trial: Trial) => {
    const updatedTrials = trials.map(t => 
      t.id === trial.id ? trial : t
    );
    await chrome.storage.sync.set({ trials: updatedTrials });
    setEditingTrial(null);
    toast({
      title: "Trial updated successfully!",
      description: "Your changes have been saved.",
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4 flex gap-4">
        <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="startDate">Start Date</SelectItem>
            <SelectItem value="serviceName">Service Name</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(value: Trial['status'] | 'all') => setFilterStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="serviceName">Service Name</Label>
          <Input
            id="serviceName"
            value={newTrial.serviceName}
            onChange={(e) => setNewTrial({...newTrial, serviceName: e.target.value})}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={newTrial.startDate}
            onChange={(e) => setNewTrial({...newTrial, startDate: e.target.value})}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="duration">Duration (days)</Label>
          <Input
            id="duration"
            type="number"
            value={newTrial.duration}
            onChange={(e) => setNewTrial({...newTrial, duration: parseInt(e.target.value)})}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Add Trial
        </Button>
      </form>

      <div className="mt-8 space-y-4">
        {sortedAndFilteredTrials.map((trial) => (
          <Card key={trial.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{trial.serviceName}</h3>
                <p className="text-sm text-gray-500">
                  Starts: {new Date(trial.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Duration: {trial.duration} days
                </p>
                <Badge variant={
                  trial.status === 'active' ? 'default' :
                  trial.status === 'cancelled' ? 'secondary' : 'destructive'
                }>
                  {trial.status}
                </Badge>
                {trial.cancelUrl && (
                  <a 
                    href={trial.cancelUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline block mt-2"
                  >
                    Cancel Subscription
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTrial(trial)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(trial.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTrial} onOpenChange={() => setEditingTrial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trial</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (editingTrial) handleEdit(editingTrial);
          }}>
            {/* Add form fields for editing */}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 