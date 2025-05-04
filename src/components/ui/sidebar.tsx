import * as React from "react";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface SidebarContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger: React.RefObject<HTMLButtonElement>;
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(true);
  const trigger = React.useRef<HTMLButtonElement>(null);

  return (
    <SidebarContext.Provider value={{ open, setOpen, trigger }}>
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebarContext = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("Sidebar components must be used within a SidebarProvider");
  }
  return context;
};

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, ...props }, ref) => {
    const { open } = useSidebarContext();

    return (
      <div
        ref={ref}
        className={`shrink-0 ${open ? 'w-64' : 'w-16'} h-screen border-r transition-all duration-300 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { setOpen, open, trigger } = useSidebarContext();

  return (
    <button
      ref={(node) => {
        // Handle both the external ref and the internal trigger ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        
        // Set the trigger ref without direct assignment to read-only property
        if (trigger && node) {
          // Use a ref setter function to update the current property
          const setRef = trigger as { current: HTMLButtonElement | null };
          setRef.current = node;
        }
      }}
      onClick={() => setOpen(!open)}
      className={`flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebarContext();

  return (
    <div
      ref={ref}
      className={`flex h-14 items-center px-4 ${open ? '' : 'justify-center'} ${className}`}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={`p-2 ${className}`} {...props} />;
});
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`mt-auto p-4 ${className}`}
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={`mb-4 ${className}`} {...props} />;
});
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebarContext();

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`mb-2 px-2 text-xs font-semibold text-muted-foreground ${className}`}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={`space-y-1 ${className}`} {...props} />;
});
SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={`space-y-1 ${className}`} {...props} />;
});
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={`${className}`} {...props} />;
});
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const { open } = useSidebarContext();
  const Comp = asChild ? React.Fragment : "button";
  const childProps = asChild ? {} : { ref, ...props };

  return (
    <Comp {...childProps}>
      {asChild ? (
        React.cloneElement(props.children as React.ReactElement, {
          className: `flex items-center ${open ? 'justify-start' : 'justify-center'} w-full px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${className}`,
        })
      ) : (
        <button
          className={`flex items-center ${open ? 'justify-start' : 'justify-center'} w-full px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${className}`}
        >
          {props.children}
        </button>
      )}
    </Comp>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";
