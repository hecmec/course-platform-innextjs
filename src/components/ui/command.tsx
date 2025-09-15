"use client"

/*
  React 19 + Next.js canary note:
  cmdk currently ships (directly or via a nested dependency) its own @types/react version.
  That creates duplicate React type trees in React 19 canary which breaks JSX inference when
  we try to derive props via ComponentPropsWithoutRef<typeof CommandPrimitive>.
  Until cmdk updates, we cast the library components to any and supply lightweight prop types
  so the rest of the app (using the canonical React types) compiles cleanly.
*/

import { forwardRef, type HTMLAttributes, type InputHTMLAttributes } from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Narrow, framework-agnostic prop facades (extend as you need extra cmdk-specific props)
interface CommandRootProps extends HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  loop?: boolean
  filter?: (value: string, search: string) => number
}
// Empty interface -> alias
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type CommandListProps = HTMLAttributes<HTMLDivElement>
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type CommandEmptyProps = HTMLAttributes<HTMLDivElement>
interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  heading?: string
  value?: string
}
// Empty interface -> alias
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type CommandSeparatorProps = HTMLAttributes<HTMLDivElement>
// Omit native onSelect event to allow string callback
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type CommandItemProps = Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  value?: string
  disabled?: boolean
  onSelect?: (value: string) => void
}
interface CommandInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  // cmdk uses value/onValueChange instead of native onChange pattern internally
  value?: string
  onValueChange?: (value: string) => void
}

// Safe any casts to bridge duplicate type trees
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CommandPrimitiveRoot: any = CommandPrimitive
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CommandPrimitiveInput: any = (CommandPrimitive as any).Input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CommandPrimitiveList: any = (CommandPrimitive as any).List
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CommandPrimitiveEmpty: any = (CommandPrimitive as any).Empty
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CommandPrimitiveGroup: any = (CommandPrimitive as any).Group
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CommandPrimitiveSeparator: any = (CommandPrimitive as any).Separator
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CommandPrimitiveItem: any = (CommandPrimitive as any).Item

const Command = forwardRef<HTMLDivElement, CommandRootProps>(({ className, ...props }, ref) => (
  <CommandPrimitiveRoot
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = "Command"

const CommandDialog = ({ children, ...props }: DialogProps) => (
  <Dialog {...props}>
    <DialogContent className="overflow-hidden p-0">
      <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
        {children}
      </Command>
    </DialogContent>
  </Dialog>
)

const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitiveInput
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))
CommandInput.displayName = "CommandInput"

const CommandList = forwardRef<HTMLDivElement, CommandListProps>(({ className, ...props }, ref) => (
  <CommandPrimitiveList
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))
CommandList.displayName = "CommandList"

const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>((props, ref) => (
  <CommandPrimitiveEmpty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))
CommandEmpty.displayName = "CommandEmpty"

const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(({ className, ...props }, ref) => (
  <CommandPrimitiveGroup
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))
CommandGroup.displayName = "CommandGroup"

const CommandSeparator = forwardRef<HTMLDivElement, CommandSeparatorProps>(({ className, ...props }, ref) => (
  <CommandPrimitiveSeparator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = "CommandSeparator"

const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(({ className, ...props }, ref) => (
  <CommandPrimitiveItem
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = "CommandItem"

const CommandShortcut = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest text-muted-foreground",
      className
    )}
    {...props}
  />
)
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
