export interface DefaultStepProps {
	stepName: string;
	goToNamedStep?: (stepName: string) => void;
	previousStep?: () => void;
	nextStep?: () => void;
}
