import PlansSection from '../PlansSection'

export default function PlansSectionExample() {
  return <PlansSection onPlanSelect={(plan) => console.log('Plan selected:', plan)} />
}
