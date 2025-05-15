
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ContextAction {
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

interface ContextActionMenuProps {
  actions: ContextAction[];
  triggerClassName?: string;
  align?: 'start' | 'end' | 'center';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const ContextActionMenu: React.FC<ContextActionMenuProps> = ({
  actions,
  triggerClassName,
  align = 'end',
  side = 'bottom',
}) => {
  if (actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 p-0 focus-visible:ring-0", triggerClassName)}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side}>
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={`${action.label}-${index}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              action.action();
            }}
            disabled={action.disabled}
            className={cn(
              action.variant === 'destructive' && 'text-destructive focus:text-destructive'
            )}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContextActionMenu;
