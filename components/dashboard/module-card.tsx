import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ModuleCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  stats?: { label: string; value: string | number }[]
  className?: string
}

export function ModuleCard({
  title,
  description,
  icon: Icon,
  href,
  badge,
  badgeVariant = 'secondary',
  stats,
  className,
}: ModuleCardProps) {
  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          'h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1',
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            {badge && (
              <Badge variant={badgeVariant}>{badge}</Badge>
            )}
          </div>
          <CardTitle className="mt-4 text-lg">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        {stats && stats.length > 0 && (
          <CardContent className="pt-0">
            <div className="flex gap-4 border-t border-border pt-3">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-lg font-semibold text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
