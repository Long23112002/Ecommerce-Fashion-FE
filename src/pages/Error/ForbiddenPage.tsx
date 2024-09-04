import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Row, Col } from 'react-bootstrap'
import { ShieldExclamation } from 'react-bootstrap-icons'
import { motion, Variants } from "framer-motion"

const ForbiddenPage: React.FC = () => {
    const backgroundVariants: Variants = {
        animate: {
            backgroundPosition: ['0% 0%', '100% 100%'],
            transition: {
                repeat: Infinity,
                duration: 20,
                ease: "linear"
            }
        }
    }

    const contentVariants: Variants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
    }

    const iconVariants: Variants = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }
        }
    }

    const textVariants: Variants = {
        initial: { opacity: 0, y: 20 },
        animate: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: custom * 0.2, duration: 0.5 }
        })
    }

    const buttonVariants: Variants = {
        initial: { x: '-100%' },
        hover: { x: 0 }
    }

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light text-dark overflow-hidden">
            <motion.div
                className="position-absolute w-100 h-100"
                variants={backgroundVariants}
                animate="animate"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    zIndex: 0
                }}
            />
            <Row className="justify-content-center">
                <Col xxl={12} xs={12} md={8} lg={6}>
                    <motion.div
                        className="text-center"
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.div variants={iconVariants} animate="animate">
                            <ShieldExclamation className="text-danger" style={{ width: '6rem', height: '6rem' }} />
                        </motion.div>
                        <motion.h1
                            className="display-4 fw-bold mt-4"
                            variants={textVariants}
                            custom={1}
                        >
                            403 <span>Forbidden</span>
                        </motion.h1>
                        <motion.p
                            className="lead"
                            variants={textVariants}
                            custom={2}
                        >
                            Sorry, you don't have permission to access this page.
                        </motion.p>
                        <motion.p
                            className="text-muted"
                            variants={textVariants}
                            custom={3}
                        >
                            If you believe this is an error, please contact the administrator.
                        </motion.p>
                        <motion.div
                            variants={textVariants}
                            custom={4}
                            className="mt-4"
                        >
                            <Link to="/login" className="text-decoration-none">
                                <Button variant="outline-dark" className="position-relative overflow-hidden">
                                    <span className="position-relative z-1">Return to Home</span>
                                    <motion.div
                                        className="position-absolute top-0 start-0 w-100 h-100 bg-primary"
                                        variants={buttonVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        transition={{ duration: 0.3 }}
                                        style={{ zIndex: 0 }}
                                    />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    )
}

export default ForbiddenPage