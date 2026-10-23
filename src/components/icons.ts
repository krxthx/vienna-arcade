import {
  Activity, AlertTriangle, ArrowRightLeft, BarChart3, Bell, Bot, Boxes, Braces,
  Brain, Calculator, CalendarDays, ClipboardCheck, Coins, Cpu, Database, Eye, FileJson,
  FileText, Gauge, Globe, Hand, Hash, Layers, LibraryBig, ListChecks, Mail, MemoryStick,
  MessageSquare, Network, Package, Quote, Radio, Repeat, Route, Scale, Scissors, Search,
  ShieldCheck, Sparkles, SquareTerminal, Split, Target, Timer, Trophy, UserCheck, Users,
  Wrench, Zap, type LucideIcon,
} from 'lucide-react'
import type { IconKey } from '../types'

export const ICONS: Record<IconKey, LucideIcon> = {
  brain: Brain, globe: Globe, database: Database, calculator: Calculator, sparkles: Sparkles,
  mail: Mail, network: Network, 'user-check': UserCheck, 'clipboard-check': ClipboardCheck,
  calendar: CalendarDays, 'file-text': FileText, terminal: SquareTerminal, library: LibraryBig,
  memory: MemoryStick, cpu: Cpu, gauge: Gauge, timer: Timer, repeat: Repeat, eye: Eye,
  scale: Scale, route: Route, search: Search, wrench: Wrench, quote: Quote, shield: ShieldCheck,
  zap: Zap, bot: Bot, users: Users, scissors: Scissors, layers: Layers, target: Target,
  activity: Activity, boxes: Boxes, split: Split, radio: Radio, 'bar-chart': BarChart3,
  message: MessageSquare, hash: Hash, package: Package, braces: Braces, hand: Hand,
  'list-checks': ListChecks, alert: AlertTriangle, trophy: Trophy, coins: Coins,
  'arrow-right-left': ArrowRightLeft, 'file-json': FileJson, bell: Bell,
}

