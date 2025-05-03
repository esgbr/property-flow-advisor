
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Search, 
  Building, 
  DollarSign, 
  MessageSquare, 
  Filter, 
  ChevronDown,
  Star,
  Mail,
  Plus,
  Clock,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvestorProfile {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  investmentSize: {
    min: number;
    max: number;
  };
  investmentTypes: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  bio: string;
  lastActive: string;
  matchScore?: number;
}

interface ProjectListing {
  id: string;
  title: string;
  location: string;
  propertyType: string;
  investmentAmount: number;
  investorsNeeded: number;
  currentInvestors: number;
  returnTarget: string;
  timeline: string;
  description: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  status: 'open' | 'filling' | 'closed';
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
}

const SAMPLE_INVESTORS: InvestorProfile[] = [
  {
    id: 'inv-1',
    name: 'Alex Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
    location: 'Austin, TX',
    investmentSize: {
      min: 50000,
      max: 250000
    },
    investmentTypes: ['Multi-family', 'Commercial'],
    experience: 'advanced',
    interests: ['Value-add', 'Cash flow', 'Long-term growth'],
    bio: 'Real estate investor with 10+ years experience focusing on multi-family and commercial properties in the Texas area.',
    lastActive: '2025-05-01T15:30:00',
    matchScore: 89
  },
  {
    id: 'inv-2',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    location: 'Denver, CO',
    investmentSize: {
      min: 100000,
      max: 500000
    },
    investmentTypes: ['Residential', 'Fix and Flip'],
    experience: 'intermediate',
    interests: ['Renovation', 'Quick returns', 'Urban markets'],
    bio: 'Real estate entrepreneur specializing in fix and flip projects with a focus on maximizing ROI through strategic renovations.',
    lastActive: '2025-05-02T09:45:00',
    matchScore: 76
  },
  {
    id: 'inv-3',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    location: 'Seattle, WA',
    investmentSize: {
      min: 200000,
      max: 1000000
    },
    investmentTypes: ['Commercial', 'Industrial'],
    experience: 'advanced',
    interests: ['NNN leases', 'Stable returns', 'Tech corridors'],
    bio: 'Commercial real estate investor with a background in tech. Looking for partners on larger industrial and office projects.',
    lastActive: '2025-05-03T11:20:00',
    matchScore: 92
  },
  {
    id: 'inv-4',
    name: 'Lisa Thompson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    location: 'Nashville, TN',
    investmentSize: {
      min: 25000,
      max: 100000
    },
    investmentTypes: ['Single-family', 'Vacation Rentals'],
    experience: 'beginner',
    interests: ['Airbnb', 'Music districts', 'First-time investment'],
    bio: 'New investor interested in short-term rental properties in Nashville and surrounding areas. Looking for mentor partners.',
    lastActive: '2025-05-01T17:15:00',
    matchScore: 65
  },
  {
    id: 'inv-5',
    name: 'David Washington',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    location: 'Miami, FL',
    investmentSize: {
      min: 150000,
      max: 750000
    },
    investmentTypes: ['Luxury Condos', 'Waterfront Properties'],
    experience: 'intermediate',
    interests: ['High-end market', 'Foreign investors', 'Appreciating areas'],
    bio: 'Specializing in the South Florida luxury market with connections to international investors looking for premium properties.',
    lastActive: '2025-05-02T14:10:00',
    matchScore: 81
  }
];

const SAMPLE_PROJECTS: ProjectListing[] = [
  {
    id: 'proj-1',
    title: 'Riverside Apartments Renovation',
    location: 'Austin, TX',
    propertyType: 'Multi-family',
    investmentAmount: 500000,
    investorsNeeded: 4,
    currentInvestors: 2,
    returnTarget: '12-15% annual',
    timeline: '24-36 months',
    description: 'Value-add opportunity for a 24-unit apartment building in a rapidly appreciating area of East Austin. The property needs moderate renovations to increase rents by 25%.',
    createdBy: {
      id: 'inv-1',
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80'
    },
    createdAt: '2025-04-15T10:30:00',
    status: 'open'
  },
  {
    id: 'proj-2',
    title: 'Downtown Office Conversion',
    location: 'Denver, CO',
    propertyType: 'Commercial',
    investmentAmount: 1200000,
    investorsNeeded: 6,
    currentInvestors: 3,
    returnTarget: '10-12% annual',
    timeline: '36-48 months',
    description: 'Converting an outdated office building into modern coworking spaces and small business suites in a prime downtown location with high foot traffic.',
    createdBy: {
      id: 'inv-3',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
    },
    createdAt: '2025-04-20T14:45:00',
    status: 'filling'
  },
  {
    id: 'proj-3',
    title: 'Beach House Rental Portfolio',
    location: 'Miami, FL',
    propertyType: 'Vacation Rentals',
    investmentAmount: 900000,
    investorsNeeded: 3,
    currentInvestors: 1,
    returnTarget: '15-18% annual',
    timeline: '12-24 months',
    description: 'Portfolio of 3 beach houses with strong vacation rental history. Looking for partners to expand with additional properties in the area.',
    createdBy: {
      id: 'inv-5',
      name: 'David Washington',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
    },
    createdAt: '2025-04-25T09:15:00',
    status: 'open'
  },
  {
    id: 'proj-4',
    title: 'Single-Family Home Package',
    location: 'Nashville, TN',
    propertyType: 'Single-family',
    investmentAmount: 375000,
    investorsNeeded: 3,
    currentInvestors: 2,
    returnTarget: '8-10% annual',
    timeline: '60+ months',
    description: 'Package of 3 single-family homes in growing neighborhoods. Properties are already rented with stable tenants and positive cash flow.',
    createdBy: {
      id: 'inv-4',
      name: 'Lisa Thompson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'
    },
    createdAt: '2025-04-22T16:20:00',
    status: 'filling'
  }
];

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      {
        id: 'current-user',
        name: 'You',
        avatar: undefined
      },
      {
        id: 'inv-1',
        name: 'Alex Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80'
      }
    ],
    lastMessage: {
      content: 'I'd be interested in discussing your Riverside Apartments project further.',
      timestamp: '2025-05-02T14:45:00',
      senderId: 'current-user'
    },
    unreadCount: 0
  },
  {
    id: 'conv-2',
    participants: [
      {
        id: 'current-user',
        name: 'You',
        avatar: undefined
      },
      {
        id: 'inv-3',
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
      }
    ],
    lastMessage: {
      content: 'Let me send you the prospectus for the Downtown Office Conversion project.',
      timestamp: '2025-05-03T09:20:00',
      senderId: 'inv-3'
    },
    unreadCount: 2
  }
];

const SAMPLE_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    senderId: 'current-user',
    senderName: 'You',
    senderAvatar: undefined,
    recipientId: 'inv-1',
    content: 'Hi Alex, I noticed your Riverside Apartments project and I'm interested in learning more about it.',
    timestamp: '2025-05-01T10:30:00',
    read: true
  },
  {
    id: 'msg-2',
    senderId: 'inv-1',
    senderName: 'Alex Rodriguez',
    senderAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
    recipientId: 'current-user',
    content: 'Hello! Thanks for reaching out. The Riverside project is a great opportunity with strong cash flow potential. Do you have any specific questions?',
    timestamp: '2025-05-01T14:22:00',
    read: true
  },
  {
    id: 'msg-3',
    senderId: 'current-user',
    senderName: 'You',
    senderAvatar: undefined,
    recipientId: 'inv-1',
    content: 'I'd like to know more about the renovation plan and timeline. Also, what's the minimum investment amount you're looking for from each partner?',
    timestamp: '2025-05-01T16:45:00',
    read: true
  },
  {
    id: 'msg-4',
    senderId: 'inv-1',
    senderName: 'Alex Rodriguez',
    senderAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
    recipientId: 'current-user',
    content: 'We're planning moderate renovations over 6-8 months - new appliances, flooring, and some cosmetic updates. The minimum investment is $125K per partner. Can we set up a call to discuss further?',
    timestamp: '2025-05-02T09:15:00',
    read: true
  },
  {
    id: 'msg-5',
    senderId: 'current-user',
    senderName: 'You',
    senderAvatar: undefined,
    recipientId: 'inv-1',
    content: 'I'd be interested in discussing your Riverside Apartments project further. Are you available for a call tomorrow afternoon?',
    timestamp: '2025-05-02T14:45:00',
    read: true
  },
  {
    id: 'msg-6',
    senderId: 'current-user',
    senderName: 'You',
    senderAvatar: undefined,
    recipientId: 'inv-3',
    content: 'Hi Michael, I'm curious about your Downtown Office Conversion project. What kind of partners are you looking for?',
    timestamp: '2025-05-02T15:30:00',
    read: true
  },
  {
    id: 'msg-7',
    senderId: 'inv-3',
    senderName: 'Michael Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    recipientId: 'current-user',
    content: 'Thanks for reaching out! We're looking for partners who can invest $200K+ and ideally have some experience with commercial renovations or office spaces. Are you familiar with the Denver market?',
    timestamp: '2025-05-03T08:45:00',
    read: false
  },
  {
    id: 'msg-8',
    senderId: 'inv-3',
    senderName: 'Michael Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    recipientId: 'current-user',
    content: 'Let me send you the prospectus for the Downtown Office Conversion project. It has all the details on our plans and financial projections.',
    timestamp: '2025-05-03T09:20:00',
    read: false
  }
];

const InvestmentPartnerMatching: React.FC = () => {
  const [activeTab, setActiveTab] = useState('find-partners');
  const [investors, setInvestors] = useState(SAMPLE_INVESTORS);
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS);
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorProfile | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectListing | null>(null);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
    investmentMin: 0,
    investmentMax: 0,
    experience: ''
  });
  
  const { toast } = useToast();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Sample new project form state
  const [newProject, setNewProject] = useState<Partial<ProjectListing>>({
    title: '',
    location: '',
    propertyType: '',
    investmentAmount: 0,
    investorsNeeded: 1,
    returnTarget: '',
    timeline: '',
    description: ''
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeConversation) {
      scrollToBottom();
      
      // Mark messages as read
      const updatedMessages = messages.map(msg => {
        if (msg.senderId !== 'current-user' && !msg.read && 
            conversations.find(c => c.id === activeConversation)?.participants.some(p => p.id === msg.senderId)) {
          return { ...msg, read: true };
        }
        return msg;
      });
      
      setMessages(updatedMessages);
      
      // Update unread count in conversation
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversation) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
    }
  }, [activeConversation, messages]);

  const handleSendMessage = () => {
    if (!activeConversation || !newMessage.trim()) return;
    
    const conversation = conversations.find(c => c.id === activeConversation);
    if (!conversation) return;
    
    const recipient = conversation.participants.find(p => p.id !== 'current-user');
    if (!recipient) return;
    
    const newMsg: Message = {
      id: `msg-${new Date().getTime()}`,
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: undefined,
      recipientId: recipient.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMsg]);
    
    // Update last message in conversation
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          lastMessage: {
            content: newMessage,
            timestamp: new Date().toISOString(),
            senderId: 'current-user'
          }
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setNewMessage('');
    
    setTimeout(scrollToBottom, 100);
    
    toast({
      title: 'Message Sent',
      description: `Message sent to ${recipient.name}`
    });
  };

  const startNewConversation = (investor: InvestorProfile) => {
    // Check if conversation already exists
    const existingConv = conversations.find(conv => 
      conv.participants.some(p => p.id === investor.id)
    );
    
    if (existingConv) {
      setActiveConversation(existingConv.id);
      setActiveTab('messages');
      return;
    }
    
    // Create new conversation
    const newConv: Conversation = {
      id: `conv-${new Date().getTime()}`,
      participants: [
        {
          id: 'current-user',
          name: 'You',
          avatar: undefined
        },
        {
          id: investor.id,
          name: investor.name,
          avatar: investor.avatar
        }
      ],
      lastMessage: {
        content: 'Start a conversation...',
        timestamp: new Date().toISOString(),
        senderId: 'system'
      },
      unreadCount: 0
    };
    
    setConversations([...conversations, newConv]);
    setActiveConversation(newConv.id);
    setActiveTab('messages');
  };

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.location) {
      toast({
        title: 'Missing Information',
        description: 'Please provide all required information',
        variant: 'destructive'
      });
      return;
    }
    
    const createdProject: ProjectListing = {
      id: `proj-${new Date().getTime()}`,
      title: newProject.title || '',
      location: newProject.location || '',
      propertyType: newProject.propertyType || '',
      investmentAmount: newProject.investmentAmount || 0,
      investorsNeeded: newProject.investorsNeeded || 1,
      currentInvestors: 0,
      returnTarget: newProject.returnTarget || '',
      timeline: newProject.timeline || '',
      description: newProject.description || '',
      createdBy: {
        id: 'current-user',
        name: 'You',
        avatar: undefined
      },
      createdAt: new Date().toISOString(),
      status: 'open'
    };
    
    setProjects([createdProject, ...projects]);
    setShowNewProjectDialog(false);
    
    toast({
      title: 'Project Created',
      description: 'Your investment opportunity has been listed'
    });
    
    // Reset form
    setNewProject({
      title: '',
      location: '',
      propertyType: '',
      investmentAmount: 0,
      investorsNeeded: 1,
      returnTarget: '',
      timeline: '',
      description: ''
    });
  };

  const filteredInvestors = investors.filter(investor => {
    // Filter by search query
    if (searchQuery && !investor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !investor.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !investor.investmentTypes.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Filter by property type
    if (filters.propertyType && !investor.investmentTypes.some(type => 
      type.toLowerCase().includes(filters.propertyType.toLowerCase()))) {
      return false;
    }
    
    // Filter by location
    if (filters.location && !investor.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filter by investment range
    if (filters.investmentMax > 0 && investor.investmentSize.min > filters.investmentMax) {
      return false;
    }
    if (filters.investmentMin > 0 && investor.investmentSize.max < filters.investmentMin) {
      return false;
    }
    
    // Filter by experience
    if (filters.experience && investor.experience !== filters.experience) {
      return false;
    }
    
    return true;
  });

  const filteredProjects = projects.filter(project => {
    // Filter by search query
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !project.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !project.propertyType.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by property type
    if (filters.propertyType && !project.propertyType.toLowerCase().includes(filters.propertyType.toLowerCase())) {
      return false;
    }
    
    // Filter by location
    if (filters.location && !project.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filter by investment range
    if (filters.investmentMin > 0 && project.investmentAmount < filters.investmentMin) {
      return false;
    }
    if (filters.investmentMax > 0 && project.investmentAmount > filters.investmentMax) {
      return false;
    }
    
    return true;
  });

  const resetFilters = () => {
    setFilters({
      propertyType: '',
      location: '',
      investmentMin: 0,
      investmentMax: 0,
      experience: ''
    });
    setSearchQuery('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getConversationMessages = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return [];
    
    const participantIds = conversation.participants.map(p => p.id);
    
    return messages.filter(msg => 
      (participantIds.includes(msg.senderId) && participantIds.includes(msg.recipientId))
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getTotalUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Investment Partner Matching</h1>
        <p className="text-muted-foreground">Connect with compatible investors for your real estate deals</p>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="find-partners">
            <Users className="h-4 w-4 mr-2" />
            Find Partners
          </TabsTrigger>
          <TabsTrigger value="view-opportunities">
            <Building className="h-4 w-4 mr-2" />
            Investment Opportunities
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
            {getTotalUnreadCount() > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {getTotalUnreadCount()}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="my-projects">
            <DollarSign className="h-4 w-4 mr-2" />
            My Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="find-partners" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3">
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="relative w-full md:w-3/4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name, location, or investment type"
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full md:w-auto">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                            {Object.values(filters).some(val => val !== '' && val !== 0) && (
                              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                                !
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-4">
                            <h4 className="font-medium">Filter Partners</h4>
                            
                            <div className="space-y-2">
                              <Label htmlFor="propertyType">Property Type</Label>
                              <Input 
                                id="propertyType"
                                placeholder="e.g., Multi-family, Commercial"
                                value={filters.propertyType}
                                onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input 
                                id="location"
                                placeholder="e.g., Austin, TX"
                                value={filters.location}
                                onChange={(e) => setFilters({...filters, location: e.target.value})}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="minInvestment">Min Investment ($)</Label>
                                <Input 
                                  id="minInvestment"
                                  type="number"
                                  value={filters.investmentMin || ''}
                                  onChange={(e) => setFilters({...filters, investmentMin: Number(e.target.value)})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="maxInvestment">Max Investment ($)</Label>
                                <Input 
                                  id="maxInvestment"
                                  type="number"
                                  value={filters.investmentMax || ''}
                                  onChange={(e) => setFilters({...filters, investmentMax: Number(e.target.value)})}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="experience">Experience Level</Label>
                              <select 
                                id="experience"
                                className="w-full p-2 border rounded"
                                value={filters.experience}
                                onChange={(e) => setFilters({...filters, experience: e.target.value})}
                              >
                                <option value="">Any Level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                              </select>
                            </div>
                            
                            <div className="flex justify-between">
                              <Button variant="outline" size="sm" onClick={resetFilters}>
                                Reset
                              </Button>
                              <Button size="sm">
                                Apply Filters
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Sort
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Match Score (High to Low)</DropdownMenuItem>
                          <DropdownMenuItem>Recently Active</DropdownMenuItem>
                          <DropdownMenuItem>Investment Size (High to Low)</DropdownMenuItem>
                          <DropdownMenuItem>Investment Size (Low to High)</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredInvestors.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-1">No investors found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search criteria or filters
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredInvestors.map((investor) => (
                        <div 
                          key={investor.id} 
                          className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:bg-accent/20 transition-colors cursor-pointer"
                          onClick={() => setSelectedInvestor(investor)}
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={investor.avatar} />
                              <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <h3 className="font-medium flex items-center">
                                {investor.name}
                                {investor.matchScore && investor.matchScore >= 80 && (
                                  <Badge variant="secondary" className="ml-2 gap-1">
                                    <Star className="h-3 w-3 fill-current" />
                                    {investor.matchScore}% Match
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground">{investor.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                              {investor.investmentTypes.map((type) => (
                                <Badge variant="outline" key={type}>
                                  {type}
                                </Badge>
                              ))}
                              <Badge 
                                variant="outline" 
                                className="bg-accent/40"
                              >
                                ${investor.investmentSize.min.toLocaleString()} - ${investor.investmentSize.max.toLocaleString()}
                              </Badge>
                              <Badge 
                                variant="outline"
                                className={
                                  investor.experience === 'beginner' ? 'bg-green-100' :
                                  investor.experience === 'intermediate' ? 'bg-blue-100' :
                                  'bg-purple-100'
                                }
                              >
                                {investor.experience}
                              </Badge>
                            </div>
                            
                            <p className="mt-2 text-sm line-clamp-2">
                              {investor.bio}
                            </p>
                          </div>
                          
                          <div className="flex flex-col mt-2 md:mt-0 md:ml-2 md:justify-center gap-2">
                            <Button size="sm" onClick={(e) => {
                              e.stopPropagation();
                              startNewConversation(investor);
                            }}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-1/3">
              {selectedInvestor ? (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedInvestor.avatar} />
                          <AvatarFallback>{selectedInvestor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{selectedInvestor.name}</CardTitle>
                          <CardDescription>{selectedInvestor.location}</CardDescription>
                        </div>
                      </div>
                      
                      {selectedInvestor.matchScore && (
                        <Badge className="gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          {selectedInvestor.matchScore}% Match
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">About</h4>
                      <p className="text-sm">{selectedInvestor.bio}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Investment Range</h4>
                      <p className="text-sm">${selectedInvestor.investmentSize.min.toLocaleString()} - ${selectedInvestor.investmentSize.max.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Interested In</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedInvestor.investmentTypes.map((type) => (
                          <Badge variant="secondary" key={type}>
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Focus Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedInvestor.interests.map((interest) => (
                          <Badge variant="outline" key={interest}>
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Experience Level</h4>
                      <Badge 
                        variant="outline"
                        className={
                          selectedInvestor.experience === 'beginner' ? 'bg-green-100' :
                          selectedInvestor.experience === 'intermediate' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }
                      >
                        {selectedInvestor.experience.charAt(0).toUpperCase() + selectedInvestor.experience.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-xs text-muted-foreground text-center">
                        Last active {formatTimestamp(selectedInvestor.lastActive)}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => startNewConversation(selectedInvestor)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Conversation
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Select an Investor</h3>
                    <p className="text-muted-foreground">
                      Click on an investor profile to view more details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="view-opportunities" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3">
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="relative w-full md:w-3/4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by title, location, or property type"
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full md:w-auto">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                            {Object.values(filters).some(val => val !== '' && val !== 0) && (
                              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                                !
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-4">
                            <h4 className="font-medium">Filter Opportunities</h4>
                            
                            <div className="space-y-2">
                              <Label htmlFor="propertyType">Property Type</Label>
                              <Input 
                                id="propertyType"
                                placeholder="e.g., Multi-family, Commercial"
                                value={filters.propertyType}
                                onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input 
                                id="location"
                                placeholder="e.g., Austin, TX"
                                value={filters.location}
                                onChange={(e) => setFilters({...filters, location: e.target.value})}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="minInvestment">Min Investment ($)</Label>
                                <Input 
                                  id="minInvestment"
                                  type="number"
                                  value={filters.investmentMin || ''}
                                  onChange={(e) => setFilters({...filters, investmentMin: Number(e.target.value)})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="maxInvestment">Max Investment ($)</Label>
                                <Input 
                                  id="maxInvestment"
                                  type="number"
                                  value={filters.investmentMax || ''}
                                  onChange={(e) => setFilters({...filters, investmentMax: Number(e.target.value)})}
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-between">
                              <Button variant="outline" size="sm" onClick={resetFilters}>
                                Reset
                              </Button>
                              <Button size="sm">
                                Apply Filters
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Sort
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Newest First</DropdownMenuItem>
                          <DropdownMenuItem>Investment Size (High to Low)</DropdownMenuItem>
                          <DropdownMenuItem>Investment Size (Low to High)</DropdownMenuItem>
                          <DropdownMenuItem>Location (A-Z)</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-1">No opportunities found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search criteria or filters
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProjects.map((project) => (
                        <div 
                          key={project.id} 
                          className="border rounded-lg p-4 flex flex-col hover:bg-accent/20 transition-colors cursor-pointer"
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{project.title}</h3>
                              <p className="text-sm text-muted-foreground">{project.location}</p>
                            </div>
                            <Badge 
                              variant={
                                project.status === 'open' ? "default" :
                                project.status === 'filling' ? "secondary" : "outline"
                              }
                            >
                              {project.status === 'open' ? 'Open' :
                               project.status === 'filling' ? 'Filling Fast' : 'Closed'}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-sm font-medium">Property Type</p>
                              <p className="text-sm">{project.propertyType}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Investment</p>
                              <p className="text-sm">${project.investmentAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Target Return</p>
                              <p className="text-sm">{project.returnTarget}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm line-clamp-2">{project.description}</p>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={project.createdBy.avatar} />
                                <AvatarFallback>{project.createdBy.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{project.createdBy.name}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(project.createdAt)}
                              </span>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              {project.currentInvestors}/{project.investorsNeeded} investors
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-1/3">
              {selectedProject ? (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{selectedProject.title}</CardTitle>
                        <CardDescription>{selectedProject.location}</CardDescription>
                      </div>
                      <Badge 
                        variant={
                          selectedProject.status === 'open' ? "default" :
                          selectedProject.status === 'filling' ? "secondary" : "outline"
                        }
                      >
                        {selectedProject.status === 'open' ? 'Open' :
                         selectedProject.status === 'filling' ? 'Filling Fast' : 'Closed'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Project Overview</h4>
                      <p className="text-sm">{selectedProject.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Property Type</h4>
                        <p className="text-sm">{selectedProject.propertyType}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Investment Amount</h4>
                        <p className="text-sm">${selectedProject.investmentAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Target Return</h4>
                        <p className="text-sm">{selectedProject.returnTarget}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Timeline</h4>
                        <p className="text-sm">{selectedProject.timeline}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Investors</h4>
                      <div className="flex items-center">
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${(selectedProject.currentInvestors / selectedProject.investorsNeeded) * 100}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm">
                          {selectedProject.currentInvestors}/{selectedProject.investorsNeeded}
                        </span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedProject.createdBy.avatar} />
                        <AvatarFallback>{selectedProject.createdBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Posted by {selectedProject.createdBy.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(selectedProject.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button 
                      className="w-full"
                      onClick={() => {
                        const investor = investors.find(inv => inv.id === selectedProject?.createdBy.id);
                        if (investor) {
                          startNewConversation(investor);
                        } else {
                          toast({
                            title: "Unable to start conversation",
                            description: "This feature is limited in the demo"
                          });
                        }
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Project Owner
                    </Button>
                    {selectedProject.status !== 'closed' && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "Expression of Interest Sent",
                            description: "The project owner has been notified of your interest"
                          });
                        }}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Express Interest
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Building className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Select a Project</h3>
                    <p className="text-muted-foreground">
                      Click on a project to view more details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-1">No conversations yet</h3>
                      <p className="text-muted-foreground">
                        Start messaging potential investment partners
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conversations.map((conversation) => {
                        const otherParticipant = conversation.participants.find(p => p.id !== 'current-user');
                        if (!otherParticipant) return null;
                        
                        return (
                          <div 
                            key={conversation.id} 
                            className={`p-3 rounded-lg cursor-pointer 
                              ${activeConversation === conversation.id ? 'bg-accent' : 'hover:bg-accent/50'}
                              ${conversation.unreadCount > 0 && 'border-l-4 border-primary'}`}
                            onClick={() => setActiveConversation(conversation.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={otherParticipant.avatar} />
                                <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                  <h3 className="font-medium truncate">{otherParticipant.name}</h3>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimestamp(conversation.lastMessage.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.lastMessage.senderId === 'current-user' ? 'You: ' : ''}
                                  {conversation.lastMessage.content}
                                </p>
                              </div>
                              {conversation.unreadCount > 0 && (
                                <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-xs text-primary-foreground font-medium">
                                    {conversation.unreadCount}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-2/3">
              <Card className="h-[600px] flex flex-col">
                {activeConversation ? (
                  <>
                    <CardHeader className="pb-3 border-b">
                      {(() => {
                        const conversation = conversations.find(c => c.id === activeConversation);
                        if (!conversation) return null;
                        
                        const otherParticipant = conversation.participants.find(p => p.id !== 'current-user');
                        if (!otherParticipant) return null;
                        
                        return (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={otherParticipant.avatar} />
                              <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{otherParticipant.name}</CardTitle>
                            </div>
                          </div>
                        );
                      })()}
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-4">
                        {getConversationMessages(activeConversation).map((message) => (
                          <div 
                            key={message.id}
                            className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.senderId === 'current-user' 
                                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                  : 'bg-accent text-accent-foreground rounded-tl-none'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                                {formatTimestamp(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </CardContent>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button onClick={handleSendMessage}>Send</Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <CardContent className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Select a Conversation</h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list to start messaging
                    </p>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="my-projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Investment Projects</h2>
            
            <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Investment Opportunity</DialogTitle>
                  <DialogDescription>
                    List your project to find compatible investment partners
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input 
                      id="title" 
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={newProject.location}
                        onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                        placeholder="City, State"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Input 
                        id="propertyType" 
                        value={newProject.propertyType}
                        onChange={(e) => setNewProject({...newProject, propertyType: e.target.value})}
                        placeholder="e.g., Multi-family, Commercial"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="investmentAmount">Total Investment Amount ($)</Label>
                      <Input 
                        id="investmentAmount" 
                        type="number"
                        value={newProject.investmentAmount || ''}
                        onChange={(e) => setNewProject({...newProject, investmentAmount: Number(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="investorsNeeded">Number of Investors Needed</Label>
                      <Input 
                        id="investorsNeeded" 
                        type="number"
                        value={newProject.investorsNeeded || ''}
                        onChange={(e) => setNewProject({...newProject, investorsNeeded: Number(e.target.value)})}
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="returnTarget">Target Return</Label>
                      <Input 
                        id="returnTarget" 
                        value={newProject.returnTarget}
                        onChange={(e) => setNewProject({...newProject, returnTarget: e.target.value})}
                        placeholder="e.g., 12-15% annual"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Investment Timeline</Label>
                      <Input 
                        id="timeline" 
                        value={newProject.timeline}
                        onChange={(e) => setNewProject({...newProject, timeline: e.target.value})}
                        placeholder="e.g., 24-36 months"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <textarea 
                      id="description"
                      className="w-full p-2 border rounded h-24"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Describe the investment opportunity in detail..."
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject}>Create Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>My Listed Projects</CardTitle>
              <CardDescription>
                Investment opportunities you've created to find partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projects.filter(p => p.createdBy.id === 'current-user').length === 0 ? (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">No projects listed yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first investment opportunity to find partners
                  </p>
                  <Button onClick={() => setShowNewProjectDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects
                    .filter(p => p.createdBy.id === 'current-user')
                    .map(project => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{project.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{project.location}</Badge>
                              <Badge variant="outline">{project.propertyType}</Badge>
                              <Badge 
                                variant={
                                  project.status === 'open' ? "default" :
                                  project.status === 'filling' ? "secondary" : "outline"
                                }
                              >
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Open menu</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                  <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Project</DropdownMenuItem>
                              <DropdownMenuItem>View Interested Investors</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete Project</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm line-clamp-2">{project.description}</p>
                        </div>
                        
                        <div className="mt-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Investment</p>
                              <p className="text-sm font-medium">${project.investmentAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Target Return</p>
                              <p className="text-sm font-medium">{project.returnTarget}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                              <p className="text-sm font-medium">{project.timeline}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {project.currentInvestors}/{project.investorsNeeded} investors
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">Posted {formatTimestamp(project.createdAt)}</span>
                          </div>
                        </div>
                        
                        {project.status !== 'closed' && (
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">View Project</Button>
                            <Button size="sm" className="flex-1">Find Partners</Button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Projects I've Joined</CardTitle>
              <CardDescription>
                Investment opportunities where you're participating as a partner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Check className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">No joined projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Browse available opportunities and express interest to get started
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('view-opportunities')}
                >
                  Browse Opportunities
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentPartnerMatching;
